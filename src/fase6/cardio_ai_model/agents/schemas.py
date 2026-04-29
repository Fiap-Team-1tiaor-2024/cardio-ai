from __future__ import annotations

from pydantic import BaseModel, Field


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
    texto_formatado: str | None = None