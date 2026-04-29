from __future__ import annotations

import json
import os

from dotenv import load_dotenv
from typing import TYPE_CHECKING

from openai import AsyncOpenAI

from .schemas import RecomendacaoFinal

load_dotenv()

if TYPE_CHECKING:
    from .analyst import AgenteAnalistaRisco
    from .specialist import AgenteEspecialistaProtocolos


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
if not GEMINI_API_KEY:
    raise EnvironmentError("Defina a variável de ambiente GEMINI_API_KEY.")

client = AsyncOpenAI(
    api_key=GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

MODEL_NAME = "gemini-2.5-flash-lite"


class AgenteOrquestrador:
    def __init__(
        self,
        analista: AgenteAnalistaRisco,
        especialista: AgenteEspecialistaProtocolos,
    ):
        self.analista = analista
        self.especialista = especialista
        self.historico: list[str] = []

    async def _gerar_texto_formatado_llm(
        self,
        recomendacao: RecomendacaoFinal,
    ) -> str:
        prompt = f"""
Você é o Agente Orquestrador da Cardio AI.

Monte uma resposta final clara, objetiva e profissional em português, com esta estrutura:

1. Paciente
2. Probabilidade prevista
3. Classificação de risco
4. Urgência
5. Protocolos sugeridos
6. Observações

Dados:
{json.dumps({
    "paciente": recomendacao.paciente,
    "probabilidade": recomendacao.probabilidade_pct,
    "classificacao": recomendacao.classificacao,
    "urgencia": recomendacao.urgencia,
    "protocolos": recomendacao.protocolos,
    "observacoes": recomendacao.observacoes,
}, ensure_ascii=False)}

Não invente dados. Use apenas as informações fornecidas.
        """.strip()

        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": "Você formata respostas finais de um sistema multiagente de risco cardíaco.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
        )

        return response.choices[0].message.content or "Sem resposta do modelo."

    async def executar(
        self,
        dados_paciente: dict[str, float | int],
        nome: str,
    ) -> RecomendacaoFinal:
        self.historico = []
        self.historico.append(f"Orquestrador recebeu o paciente: {nome}")

        self.historico.append("Tool: calcular_risco_cardiaco")
        risco = self.analista.executar(dados_paciente)
        self.historico.append(
            f"Analista retornou {risco.classificacao} com probabilidade {risco.probabilidade_pct}"
        )

        self.historico.append("Tool: consultar_protocolos")
        protocolo = self.especialista.executar(risco.classificacao)
        self.historico.append(
            f"Especialista retornou {len(protocolo.protocolos)} protocolos e urgencia {protocolo.urgencia}"
        )

        self.historico.append("Tool: gerar_recomendacao_final")
        recomendacao = self.especialista.gerar_recomendacao(nome, risco, protocolo)
        recomendacao.historico = self.historico.copy()

        try:
            recomendacao.texto_formatado = await self._gerar_texto_formatado_llm(recomendacao)
        except Exception as e:
            print("Aviso: nao foi possivel usar o LLM para formatacao final.")
            print(f"Detalhes: {e}")

        return recomendacao