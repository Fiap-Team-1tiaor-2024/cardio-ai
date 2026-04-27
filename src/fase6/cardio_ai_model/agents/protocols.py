from __future__ import annotations

from typing import Any


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