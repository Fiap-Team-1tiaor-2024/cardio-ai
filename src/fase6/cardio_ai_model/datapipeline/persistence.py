from __future__ import annotations

from pathlib import Path

import joblib
from sklearn.model_selection import GridSearchCV

def save_model(grid: GridSearchCV, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(grid, output_path)
