from __future__ import annotations

from collections.abc import Mapping

import numpy as np
from sklearn.model_selection import GridSearchCV

def predict_patient_risk(
    grid: GridSearchCV,
    patient: Mapping[str, float | int],
    feature_names: list[str],
    threshold: float = 0.5,
) -> tuple[float, str]:
    missing = [name for name in feature_names if name not in patient]
    if missing:
        missing_text = ", ".join(missing)
        raise ValueError(f"Paciente sem colunas obrigatorias: {missing_text}")

    x_patient = np.array([[float(patient[name]) for name in feature_names]])
    probability = float(grid.predict_proba(x_patient)[0][1])
    label = "ALTO RISCO" if probability >= threshold else "BAIXO RISCO"
    return probability, label
