from __future__ import annotations

from collections.abc import Mapping
from pathlib import Path

import joblib
import numpy as np

from ..config import FEATURE_NAMES
from .schemas import RiskScore


class AgenteAnalistaRisco:
    def __init__(self, model_path: Path):
        if not model_path.exists():
            raise FileNotFoundError(
                f"Modelo nao encontrado em: {model_path}. Execute a Parte 1 antes."
            )
        self.model = joblib.load(model_path)

    def executar(self, dados_paciente: dict[str, float | int]) -> RiskScore:
        faltando = [f for f in FEATURE_NAMES if f not in dados_paciente]
        if faltando:
            raise ValueError(f"Campos ausentes: {', '.join(faltando)}")

        x = np.array([[float(dados_paciente[f]) for f in FEATURE_NAMES]])
        probabilidade = float(self.model.predict_proba(x)[0][1])

        classificacao = "ALTO RISCO" if probabilidade >= 0.5 else "BAIXO RISCO"

        return RiskScore(
            probabilidade=probabilidade,
            classificacao=classificacao,
            probabilidade_pct=f"{probabilidade:.2%}",
        )