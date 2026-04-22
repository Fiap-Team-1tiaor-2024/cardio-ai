# -*- coding: utf-8 -*-
"""
Parte 2 – Sistema Preditivo Multiagente para Eventos Cardíacos (Cardio AI)
Versão otimizada para Gemini:
- Mantém 3 agentes
- Usa 1 chamada de API por paciente
- Analista e Especialista rodam localmente
- Orquestrador usa Gemini só para consolidar a resposta final
"""

from __future__ import annotations

import asyncio
import json
import os
from pathlib import Path
from typing import Any

import joblib
import numpy as np
from openai import AsyncOpenAI
from pydantic import BaseModel, Field

# =========================
# Configuração Gemini
# =========================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
if not GEMINI_API_KEY:
    raise EnvironmentError("Defina a variável de ambiente GEMINI_API_KEY.")

client = AsyncOpenAI(
    api_key=GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

MODEL_NAME = "gemini-2.5-flash-lite"

# =========================
# Paths
# =========================

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "cardio_ai_model" / "artifacts" / "modelo_risco_cardiaco.pkl"

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

# =========================
# Base de protocolos
# =========================

PROTOCOLS_DB: dict[str, dict[str, Any]] = {
    "ALTO RISCO": {
        "nivel": "ALTO RISCO",
        "protocolos": [
            "P-001: Encaminhamento imediato para cardiologista",
            "P-002: Monitoramento continuo de pressao arterial (24h)",
            "P-003: ECG de repouso e de esforco",
            "P-004: Exames laboratoriais completos",
            "P-005: Avaliacao medicamentosa especializada",
        ],
        "urgencia": "ALTA – Consulta em ate 24 horas",
        "observacoes": (
            "Paciente apresenta combinacao relevante de fatores de risco. "
            "Recomendado acompanhamento prioritario."
        ),
    },
    "BAIXO RISCO": {
        "nivel": "BAIXO RISCO",
        "protocolos": [
            "P-011: Check-up anual de rotina",
            "P-012: Orientacoes gerais sobre estilo de vida saudavel",
            "P-013: Monitoramento de pressao arterial a cada 6 meses",
        ],
        "urgencia": "BAIXA – Check-up de rotina",
        "observacoes": (
            "Perfil clinico dentro de parametros aceitaveis. "
            "Manter habitos saudaveis e acompanhamento preventivo."
        ),
    },
}

# =========================
# Schemas
# =========================

class RiskScore(BaseModel):
    probabilidade: float = Field(..., ge=0.0, le=1.0)
    classificacao: str
    probabilidade_pct: str


class ProtocoloSaida(BaseModel):
    nivel: str
    protocolos: list[str]
    urgencia: str
    observacoes: str


class RecomendacaoFinal(BaseModel):
    paciente: str
    probabilidade_pct: str
    classificacao: str
    urgencia: str
    protocolos: list[str]
    observacoes: str
    historico: list[str]


# =========================
# Agente 1 - Analista de Risco
# =========================

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


# =========================
# Agente 2 - Especialista em Protocolos
# =========================

class AgenteEspecialistaProtocolos:
    def executar(self, classificacao: str) -> ProtocoloSaida:
        protocolo = PROTOCOLS_DB.get(classificacao.upper())
        if protocolo is None:
            raise ValueError(f"Classificacao desconhecida: {classificacao}")
        return ProtocoloSaida(**protocolo)


# =========================
# Agente 3 - Orquestrador
# =========================

class AgenteOrquestrador:
    def __init__(
        self,
        analista: AgenteAnalistaRisco,
        especialista: AgenteEspecialistaProtocolos,
    ):
        self.analista = analista
        self.especialista = especialista
        self.historico: list[str] = []

    async def gerar_texto_final_llm(
        self,
        nome: str,
        risco: RiskScore,
        protocolo: ProtocoloSaida,
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
Paciente: {nome}
Probabilidade: {risco.probabilidade_pct}
Classificação: {risco.classificacao}
Urgência: {protocolo.urgencia}
Protocolos: {json.dumps(protocolo.protocolos, ensure_ascii=False)}
Observações: {protocolo.observacoes}

Não invente dados. Use apenas as informações fornecidas.
""".strip()

        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": "Você organiza respostas finais de um sistema multiagente de risco cardíaco.",
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

        # Handoff lógico para o Analista
        self.historico.append("Handoff -> Agente Analista de Risco")
        risco = self.analista.executar(dados_paciente)
        self.historico.append(
            f"Analista retornou {risco.classificacao} com probabilidade {risco.probabilidade_pct}"
        )

        # Handoff lógico para o Especialista
        self.historico.append("Handoff -> Agente Especialista em Protocolos")
        protocolo = self.especialista.executar(risco.classificacao)
        self.historico.append(
            f"Especialista retornou {len(protocolo.protocolos)} protocolos e urgencia {protocolo.urgencia}"
        )

        # 1 chamada LLM só para consolidar/apresentar
        self.historico.append("Orquestrador consolidou a resposta final com apoio do LLM")
        try:
            _ = await self.gerar_texto_final_llm(nome, risco, protocolo)
        except Exception as e:
            print("Aviso: nao foi possivel usar o LLM para formatacao final.")
            print(f"Detalhes: {e}")

        return RecomendacaoFinal(
            paciente=nome,
            probabilidade_pct=risco.probabilidade_pct,
            classificacao=risco.classificacao,
            urgencia=protocolo.urgencia,
            protocolos=protocolo.protocolos,
            observacoes=protocolo.observacoes,
            historico=self.historico.copy(),
        )


# =========================
# Impressão final
# =========================

def imprimir_resultado(resultado: RecomendacaoFinal) -> None:
    print("=" * 60)
    print("CARDIO AI - SISTEMA PREDITIVO MULTIAGENTE")
    print("=" * 60)
    print(f"Paciente      : {resultado.paciente}")
    print(f"Probabilidade : {resultado.probabilidade_pct}")
    print(f"Classificacao : {resultado.classificacao}")
    print(f"Urgencia      : {resultado.urgencia}")
    print("\nProtocolos sugeridos:")
    for protocolo in resultado.protocolos:
        print(f" - {protocolo}")
    print(f"\nObservacoes: {resultado.observacoes}")
    print("\nHistorico do fluxo:")
    for evento in resultado.historico:
        print(f" - {evento}")
    print("=" * 60)


# =========================
# Execução
# =========================

async def avaliar_paciente(
    orquestrador: AgenteOrquestrador,
    dados_paciente: dict[str, float | int],
    nome: str,
) -> None:
    print(f"\n{'=' * 60}")
    print(f"Iniciando avaliacao para: {nome}")
    print(f"{'=' * 60}\n")

    try:
        resultado = await orquestrador.executar(dados_paciente, nome)
        imprimir_resultado(resultado)
    except Exception as e:
        print("Erro ao executar o fluxo multiagente.")
        print(f"Detalhes: {e}")


async def main() -> None:
    analista = AgenteAnalistaRisco(MODEL_PATH)
    especialista = AgenteEspecialistaProtocolos()
    orquestrador = AgenteOrquestrador(analista, especialista)

    carlos = {
        "gender": 2,
        "height": 172,
        "weight": 84,
        "ap_hi": 138,
        "ap_lo": 88,
        "cholesterol": 2,
        "gluc": 1,
        "smoke": 0,
        "alco": 0,
        "active": 1,
        "age_years": 52,
        "imc": 28.39,
        "pulse_pressure": 50,
    }

    ana = {
        "gender": 1,
        "height": 165,
        "weight": 62,
        "ap_hi": 118,
        "ap_lo": 76,
        "cholesterol": 1,
        "gluc": 1,
        "smoke": 0,
        "alco": 0,
        "active": 1,
        "age_years": 34,
        "imc": 22.77,
        "pulse_pressure": 42,
    }

    await avaliar_paciente(orquestrador, carlos, "Carlos, 52 anos")
    await asyncio.sleep(15)
    await avaliar_paciente(orquestrador, ana, "Ana, 34 anos")


if __name__ == "__main__":
    asyncio.run(main())