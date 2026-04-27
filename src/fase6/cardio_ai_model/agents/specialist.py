from __future__ import annotations

from .protocols import PROTOCOLS_DB
from .schemas import ProtocoloSaida


class AgenteEspecialistaProtocolos:
    def executar(self, classificacao: str) -> ProtocoloSaida:
        protocolo = PROTOCOLS_DB.get(classificacao.upper())
        if protocolo is None:
            raise ValueError(f"Classificacao desconhecida: {classificacao}")
        return ProtocoloSaida(**protocolo)