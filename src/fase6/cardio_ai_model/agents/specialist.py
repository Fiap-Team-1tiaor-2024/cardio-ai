from __future__ import annotations

from .schemas import ProtocoloSaida, RecomendacaoFinal, RiskScore
from .tools import ToolConsultarProtocolos, ToolGerarRecomendacaoFinal


class AgenteEspecialistaProtocolos:
    """
    Agente Especialista em Protocolos Clinicos.

    Utiliza as tools consultar_protocolos e gerar_recomendacao_final
    para buscar e formatar os protocolos baseados na classificacao de risco.
    """

    def __init__(self):
        self.tool_consultar = ToolConsultarProtocolos()
        self.tool_gerar = ToolGerarRecomendacaoFinal

    def executar(self, classificacao: str) -> ProtocoloSaida:
        """Executa a consulta de protocolos para a classificacao de risco."""
        return self.tool_consultar(classificacao)

    def gerar_recomendacao(
        self,
        nome_paciente: str,
        risco: RiskScore,
        protocolo: ProtocoloSaida,
    ) -> RecomendacaoFinal:
        """
        Gera a recomendacao final estruturada.

        Utiliza a tool gerar_recomendacao_final para combinar
        os dados do paciente, risco e protocolos.
        """
        recomendacao_dict = self.tool_gerar(
            nome_paciente=nome_paciente,
            risco=risco,
            protocolo=protocolo,
        )()

        return RecomendacaoFinal(
            paciente=recomendacao_dict["paciente"],
            probabilidade_pct=recomendacao_dict["probabilidade_pct"],
            classificacao=recomendacao_dict["classificacao"],
            urgencia=recomendacao_dict["urgencia"],
            protocolos=recomendacao_dict["protocolos"],
            observacoes=recomendacao_dict["observacoes"],
            historico=[],
        )