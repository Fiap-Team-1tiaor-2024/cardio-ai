# -*- coding: utf-8 -*-
"""Pipeline supervisionado de risco cardiaco (Cardio AI)."""

from __future__ import annotations

from pathlib import Path

from cardio_ai_model.datapipeline.analysis import (
        calculate_permutation_importance,
        plot_correlation_heatmap,
        print_binary_distributions,
)
from cardio_ai_model.config.config import TrainingConfig, get_default_config
from cardio_ai_model.datapipeline.data_pipeline import (
        clean_clinical_outliers,
        engineer_features,
        load_dataset,
        split_train_test,
        transform_base,
    )
from cardio_ai_model.datapipeline.evaluation import (
        evaluate_model,
        plot_confusion,
        plot_feature_importance,
        plot_roc_curve,
    )
from cardio_ai_model.datapipeline.inference import predict_patient_risk
from cardio_ai_model.datapipeline.persistence import save_model
from cardio_ai_model.training.training import train_gradient_boosting


def run_pipeline(config: TrainingConfig):
    df_inicial = load_dataset(config)
    df_base = transform_base(df_inicial)
    df_limpo = clean_clinical_outliers(df_base)

    print(f"Registros originais : {df_base.shape[0]}")
    print(f"Registros apos limpeza: {df_limpo.shape[0]}")
    print(f"Removidos: {df_base.shape[0] - df_limpo.shape[0]}")

    df_features = engineer_features(df_limpo)
    plot_correlation_heatmap(df_features)

    x_train, x_test, y_train, y_test, feature_names = split_train_test(df_features, config)
    print(f"Treino: {x_train.shape[0]} amostras")
    print(f"Teste : {x_test.shape[0]} amostras")

    print_binary_distributions(df_features, config.binary_columns)

    grid = train_gradient_boosting(x_train, y_train, config)

    print(f"Melhores parametros: {grid.best_params_}")
    print(f"Melhor F1 (CV): {grid.best_score_:.4f}")
    print(f"Acuracia no Teste: {grid.score(x_test, y_test):.4f}")

    df_perm = calculate_permutation_importance(
        grid,
        x_test,
        y_test,
        feature_names,
        config,
    )
    print(df_perm.to_string(index=False))

    accuracy, report, y_pred, y_proba = evaluate_model(grid, x_test, y_test)
    print(f"Acuracia: {accuracy:.4f}")
    print("\n--- Relatorio Completo ---")
    print(report)

    plot_confusion(y_test, y_pred)
    auc = plot_roc_curve(y_test, y_proba)
    print(f"AUC: {auc:.4f}")
    plot_feature_importance(grid, feature_names)

    save_model(grid, config.model_output_path)
    print(f"Modelo salvo em: {config.model_output_path}")

    return grid, feature_names


def run_sample_prediction(grid, feature_names: list[str]) -> None:
    carlos = {
        "gender": 2,
        "height": 172,
        "weight": 84,
        "ap_hi": 138,
        "ap_lo": 88,
        "cholesterol": 2,
        "gluc": 1,
        "smoke": 0,
        "alco": 0,
        "active": 1,
        "age_years": 52,
        "imc": 28.39,
        "pulse_pressure": 50,
    }

    probability, label = predict_patient_risk(grid, carlos, feature_names)

    print("Paciente: Carlos, 52 anos")
    print(f"Probabilidade de pico de risco: {probability:.2%}")
    print(f"Classificacao: {label}")


def main() -> None:
    config = get_default_config()

    if not config.dataset_path.exists():
        dataset_suggestion = Path(__file__).resolve().parent / "dataset" / "cardio_train.csv"
        raise FileNotFoundError(
            "Dataset nao encontrado. "
            f"Caminho esperado: {config.dataset_path}. "
            f"Sugestao: copie o arquivo para {dataset_suggestion}."
        )

    grid, feature_names = run_pipeline(config)
    run_sample_prediction(grid, feature_names)


if __name__ == "__main__":
    main()
