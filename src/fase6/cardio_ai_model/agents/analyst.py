from __future__ import annotations

from pathlib import Path

from .schemas import RiskScore
from .tools import ToolCalcularRiscoCardiaco


class AgenteAnalistaRisco:
    """
    Agente Responsavel por analisar o risco cardiaco do paciente.

    Utiliza a tool calcular_risco_cardiaco para processar os dados
    clinicos e retornar a probabilidade de risco.
    """

    def __init__(self, model_path: Path):
        self.tool_calcular_risco = ToolCalcularRiscoCardiaco(model_path)

    def executar(self, dados_paciente: dict[str, float | int]) -> RiskScore:
        """
        Executa a analise de risco para o paciente.

        Args:
            dados_paciente: Dicionario com dados clinicos do paciente

        Returns:
            RiskScore com probabilidade e classificacao
        """
        return self.tool_calcular_risco(dados_paciente)