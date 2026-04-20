from __future__ import annotations

import numpy as np
import polars as pl
from sklearn.model_selection import train_test_split

from ..config import TrainingConfig

def load_dataset(config: TrainingConfig) -> pl.DataFrame:
    return pl.read_csv(config.dataset_path, separator=config.separator)

def transform_base(df_inicial: pl.DataFrame) -> pl.DataFrame:
    return (
        df_inicial.with_columns((pl.col("age") / 365.25).cast(pl.Int32).alias("age_years"))
        .rename({"cardio": "peak_risk"})
        .drop(["id", "age"])
    )

def clean_clinical_outliers(df: pl.DataFrame) -> pl.DataFrame:
    return df.filter(
        (pl.col("ap_hi") >= 60)
        & (pl.col("ap_hi") <= 250)
        & (pl.col("ap_lo") >= 40)
        & (pl.col("ap_lo") <= 200)
        & (pl.col("ap_hi") > pl.col("ap_lo"))
        & (pl.col("height") >= 140)
        & (pl.col("height") <= 220)
        & (pl.col("weight") >= 30)
        & (pl.col("weight") <= 200)
    )

def engineer_features(df_limpo: pl.DataFrame) -> pl.DataFrame:
    return df_limpo.with_columns(
        [
            (pl.col("weight") / ((pl.col("height") / 100) ** 2)).round(2).alias("imc"),
            (pl.col("ap_hi") - pl.col("ap_lo")).alias("pulse_pressure"),
        ]
    )

def split_train_test(
    df_features: pl.DataFrame,
    config: TrainingConfig,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, list[str]]:
    x = df_features.drop("peak_risk").to_numpy()
    y = df_features["peak_risk"].to_numpy()

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=config.test_size,
        random_state=config.random_state,
        stratify=y,
    )
    feature_names = list(df_features.drop("peak_risk").columns)
    return x_train, x_test, y_train, y_test, feature_names
