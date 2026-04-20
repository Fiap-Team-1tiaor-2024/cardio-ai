from __future__ import annotations

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import polars as pl
import seaborn as sns
from sklearn.inspection import permutation_importance
from sklearn.model_selection import GridSearchCV

from ..config import TrainingConfig

def plot_correlation_heatmap(df_features: pl.DataFrame) -> None:
    df_corr = df_features.to_pandas().corr()

    plt.figure(figsize=(12, 8))
    sns.heatmap(
        df_corr,
        annot=True,
        fmt=".2f",
        cmap="coolwarm",
        center=0,
    )
    plt.title("Correlacao entre Variaveis - Dataset Cardiovascular")
    plt.show()

def print_binary_distributions(
    df_features: pl.DataFrame,
    binary_columns: tuple[str, ...],
) -> None:
    for col in binary_columns:
        counts = df_features[col].value_counts()
        print(f"\n{col}:")
        print(counts)

def calculate_permutation_importance(
    grid: GridSearchCV,
    x_test: np.ndarray,
    y_test: np.ndarray,
    feature_names: list[str],
    config: TrainingConfig,
) -> pd.DataFrame:
    result = permutation_importance(
        grid.best_estimator_,
        x_test,
        y_test,
        n_repeats=config.permutation_repeats,
        scoring=config.scoring,
        random_state=config.random_state,
        n_jobs=-1,
    )

    return pd.DataFrame(
        {
            "feature": feature_names,
            "importancia_media": result.importances_mean,
            "desvio": result.importances_std,
        }
    ).sort_values("importancia_media", ascending=False)
