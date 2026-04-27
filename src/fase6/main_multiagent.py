from __future__ import annotations

import asyncio
from pathlib import Path

from cardio_ai_model.agents import (
    AgenteAnalistaRisco,
    AgenteEspecialistaProtocolos,
    AgenteOrquestrador,
    RecomendacaoFinal,
)
from cardio_ai_model.config import get_default_config


def _get_model_path() -> Path:
    config = get_default_config()
    if config.model_output_path.exists():
        return config.model_output_path

    raise FileNotFoundError(
        f"Modelo nao encontrado em: {config.model_output_path}. "
        "Execute main.py primeiro."
    )


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
    model_path = _get_model_path()
    analista = AgenteAnalistaRisco(model_path)
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