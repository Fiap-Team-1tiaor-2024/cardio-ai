from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
from pydantic import BaseModel

from ..config import FEATURE_NAMES
from .protocols import PROTOCOLS_DB
from .schemas import ProtocoloSaida, RiskScore


class ToolCalcularRiscoCardiaco:
    """Tool para calculo de risco cardiaco usando modelo treinado."""

    def __init__(self, model_path: Path):
        if not model_path.exists():
            raise FileNotFoundError(
                f"Modelo nao encontrado em: {model_path}. Execute a Parte 1 antes."
            )
        self.model = joblib.load(model_path)

    def __call__(self, dados_paciente: dict[str, float | int]) -> RiskScore:
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


class ToolConsultarProtocolos:
    """Tool para Consulta de protocolos clinicos baseados na classificacao de risco."""

    def __call__(self, classificacao: str) -> ProtocoloSaida:
        protocolo = PROTOCOLS_DB.get(classificacao.upper())
        if protocolo is None:
            raise ValueError(f"Classificacao desconhecida: {classificacao}")
        return ProtocoloSaida(**protocolo)


class ToolGerarRecomendacaoFinal(BaseModel):
    """
    Tool para gerar recomendacao final estruturada com todos os dados.

    Combina os dados do paciente, risco cardiaco e protocolos clinicos
    em uma recomendacao completa e formatada.
    """

    nome_paciente: str
    risco: RiskScore
    protocolo: ProtocoloSaida

    def __call__(self) -> dict:
        """
        Gera a recomendacao final combinando todos os dados.

        Returns:
            Dicionario com recomendacao final estruturada
        """
        return {
            "paciente": self.nome_paciente,
            "probabilidade_pct": self.risco.probabilidade_pct,
            "classificacao": self.risco.classificacao,
            "urgencia": self.protocolo.urgencia,
            "protocolos": self.protocolo.protocolos,
            "observacoes": self.protocolo.observacoes,
        }


def calcular_risco_cardiaco(
    model_path: Path,
    dados_paciente: dict[str, float | int],
) -> RiskScore:
    """
    Tool: calcular_risco_cardiaco

    Carrega o modelo treinado e calcula a probabilidade de risco cardiaco
    para um paciente com base em seus dados clinicos.

    Args:
        model_path: Caminho para o arquivo .pkl do modelo treinado
        dados_paciente: Dicionario com dados clinicos do paciente

    Returns:
        RiskScore com probabilidade e classificacao
    """
    tool = ToolCalcularRiscoCardiaco(model_path)
    return tool(dados_paciente)


def consultar_protocolos(classificacao: str) -> ProtocoloSaida:
    """
    Tool: consultar_protocolos

    Busca protocolos clinicos baseado na classificacao de risco.

    Args:
        classificacao: Classificacao de risco (ex: "ALTO RISCO", "BAIXO RISCO")

    Returns:
        ProtocoloSaida com protocolos recomendados
    """
    tool = ToolConsultarProtocolos()
    return tool(classificacao)


def gerar_recomendacao_final(
    nome_paciente: str,
    risco: RiskScore,
    protocolo: ProtocoloSaida,
) -> dict:
    """
    Tool: gerar_recomendacao_final

    Gera uma recomendacao final estruturada combinando todos os dados:
    - Dados do paciente
    - Risco cardiaco calculado
    - Protocolos clinicos recomendados

    Args:
        nome_paciente: Nome do paciente
        risco: RiskScore com probabilidade e classificacao
        protocolo: ProtocoloSaida com protocolos recomendados

    Returns:
        Dicionario com recomendacao final estruturada
    """
    tool = ToolGerarRecomendacaoFinal(
        nome_paciente=nome_paciente,
        risco=risco,
        protocolo=protocolo,
    )
    return tool()