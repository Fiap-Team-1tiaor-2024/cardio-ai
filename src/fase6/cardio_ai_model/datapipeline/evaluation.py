from __future__ import annotations

import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
)
from sklearn.model_selection import GridSearchCV

def evaluate_model(
    grid: GridSearchCV,
    x_test: np.ndarray,
    y_test: np.ndarray,
) -> tuple[float, str, np.ndarray, np.ndarray]:
    y_pred = grid.predict(x_test)
    y_proba = grid.predict_proba(x_test)[:, 1]

    accuracy = float(accuracy_score(y_test, y_pred))
    report = classification_report(
        y_test,
        y_pred,
        target_names=["Sem risco", "Com risco"],
    )
    return accuracy, report, y_pred, y_proba

def plot_confusion(y_test: np.ndarray, y_pred: np.ndarray) -> None:
    cm = confusion_matrix(y_test, y_pred)
    disp = ConfusionMatrixDisplay(
        confusion_matrix=cm,
        display_labels=["Sem risco", "Com risco"],
    )
    disp.plot(cmap="Blues")
    plt.title("Matriz de Confusao - Modelo de Risco Cardiaco")
    plt.show()

def plot_roc_curve(y_test: np.ndarray, y_proba: np.ndarray) -> float:
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    auc = float(roc_auc_score(y_test, y_proba))

    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, color="steelblue", lw=2, label=f"Gradient Boosting (AUC = {auc:.3f})")
    plt.plot([0, 1], [0, 1], color="gray", linestyle="--", label="Modelo Aleatorio")
    plt.xlabel("Taxa de Falsos Positivos")
    plt.ylabel("Taxa de Verdadeiros Positivos (Recall)")
    plt.title("Curva ROC - Modelo de Risco Cardiaco")
    plt.legend()
    plt.show()
    return auc

def plot_feature_importance(grid: GridSearchCV, feature_names: list[str]) -> None:
    trained_model = grid.best_estimator_.named_steps["model"]
    importances = trained_model.feature_importances_
    sorted_indices = importances.argsort()[::-1]

    plt.figure(figsize=(10, 6))
    plt.bar(range(len(feature_names)), importances[sorted_indices], color="steelblue")
    plt.xticks(
        range(len(feature_names)),
        [feature_names[i] for i in sorted_indices],
        rotation=45,
        ha="right",
    )
    plt.title("Importancia das Features - Gradient Boosting")
    plt.ylabel("Importancia Relativa")
    plt.tight_layout()
    plt.show()
