from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


FEATURE_NAMES: list[str] = [
    "gender",
    "height",
    "weight",
    "ap_hi",
    "ap_lo",
    "cholesterol",
    "gluc",
    "smoke",
    "alco",
    "active",
    "age_years",
    "imc",
    "pulse_pressure",
]


@dataclass(frozen=True)
class TrainingConfig:
    dataset_path: Path
    model_output_path: Path
    separator: str = ";"
    test_size: float = 0.2
    random_state: int = 42
    cv_folds: int = 5
    scoring: str = "f1"
    permutation_repeats: int = 10
    binary_columns: tuple[str, ...] = ("smoke", "alco", "active")
    param_grid: dict[str, list[int] | list[float]] = field(
        default_factory=lambda: {
            "model__n_estimators": [100, 200],
            "model__learning_rate": [0.05, 0.1],
            "model__max_depth": [3, 5],
        }
    )


def _resolve_dataset_path(base_dir: Path) -> Path:
    candidates = [
        base_dir / "dataset" / "cardio_train.csv",
        base_dir.parent / "dataset" / "cardio_train.csv",
    ]

    for path in candidates:
        if path.exists():
            return path

    return candidates[0]


def get_default_config() -> TrainingConfig:
    fase6_dir = Path(__file__).resolve().parents[1]
    artifacts_dir = fase6_dir / "artifacts"
    return TrainingConfig(
        dataset_path=_resolve_dataset_path(fase6_dir),
        model_output_path=artifacts_dir / "modelo_risco_cardiaco.pkl",
    )
