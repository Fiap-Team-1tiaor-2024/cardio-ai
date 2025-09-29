import pandas as pd
from rapidfuzz import fuzz

relatos_file = "relatos_pacientes.txt"
mapa_file = "mapa_sintomas_doencas.csv"

mapa = pd.read_csv(mapa_file)
mapa.columns = mapa.columns.str.strip().str.lower().str.replace('ç', 'c')

sintomas_doencas = []
for _, row in mapa.iterrows():
    sintomas = []
    if "sintoma 1" in mapa.columns and pd.notna(row["sintoma 1"]):
        sintomas.append(str(row["sintoma 1"]).strip().lower())
    if "sintoma 2" in mapa.columns and pd.notna(row["sintoma 2"]):
        sintomas.append(str(row["sintoma 2"]).strip().lower())
    doenca = row["doenca associada"].strip()
    sintomas_doencas.append((sintomas, doenca))

todos_sintomas = [s for sintomas, _ in sintomas_doencas for s in sintomas]

with open(relatos_file, "r", encoding="utf-8") as f:
    relatos = [linha.strip() for linha in f if linha.strip()]

def identificar_sintomas(frase, threshold=80):
    frase_lower = frase.lower()
    sintomas_encontrados = set()

    for sintoma in todos_sintomas:
        score = fuzz.partial_ratio(sintoma, frase_lower)
        if score >= threshold:
            sintomas_encontrados.add(sintoma)

    return list(sintomas_encontrados)

def sugerir_diagnostico(frase):
    frase_lower = frase.lower()
    melhor_score = 0
    melhor_doenca = "Diagnóstico não identificado"

    for sintomas, doenca in sintomas_doencas:
        for sintoma in sintomas:
            score = fuzz.partial_ratio(sintoma, frase_lower)
            if score > melhor_score and score > 70:
                melhor_score = score
                melhor_doenca = doenca
    return melhor_doenca

print("=== Resultados do Diagnóstico ===\n")
for i, frase in enumerate(relatos, 1):
    sintomas = identificar_sintomas(frase)
    diagnostico = sugerir_diagnostico(frase)

    print(f"Paciente {i}: {frase}")
    print(f"  → Sintomas identificados: {', '.join(sintomas) if sintomas else 'nenhum'}")
    print(f"  → Possível diagnóstico: {diagnostico}\n")
