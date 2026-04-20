from __future__ import annotations

import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from ..config.config import TrainingConfig

def train_gradient_boosting(
    x_train: np.ndarray,
    y_train: np.ndarray,
    config: TrainingConfig,
) -> GridSearchCV:
    pipeline = Pipeline(
        [
            ("scaler", StandardScaler()),
            ("model", GradientBoostingClassifier(random_state=config.random_state)),
        ]
    )

    grid = GridSearchCV(
        pipeline,
        config.param_grid,
        cv=config.cv_folds,
        scoring=config.scoring,
        n_jobs=-1,
        verbose=1,
    )
    grid.fit(x_train, y_train)
    return grid
