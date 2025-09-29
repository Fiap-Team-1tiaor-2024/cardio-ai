import pandas as pd

# Base simulada ampliada com sinônimos e variações
dados = [
    # ALTO RISCO
    ["sinto dor no peito e falta de ar", "alto risco"],
    ["dor intensa no peito que irradia para o braço", "alto risco"],
    ["palpitações fortes e tontura súbita", "alto risco"],
    ["suor frio e dor no peito", "alto risco"],
    ["dor no peito com sensação de desmaio", "alto risco"],
    ["falta de ar e palpitações repentinas", "alto risco"],
    ["palpitações e dor no peito ao esforço", "alto risco"],
    ["dor no peito súbita e intensa", "alto risco"],
    ["dor no peito acompanhada de náusea", "alto risco"],
    ["tontura súbita e coração acelerado", "alto risco"],
    ["dor no peito e formigamento no braço", "alto risco"],
    ["desmaio repentino e falta de ar", "alto risco"],
    ["dor no peito com suor frio e tontura", "alto risco"],
    ["palpitações e dor no peito que piora com esforço", "alto risco"],
    ["falta de ar intensa ao mínimo esforço", "alto risco"],
    ["dor no peito e irradiação para mandíbula ou braço", "alto risco"],
    ["tontura com palpitações e suor frio", "alto risco"],
    ["sensação de desmaio com dor no peito", "alto risco"],
    ["palpitações intensas e falta de ar", "alto risco"],
    ["dor no peito com cansaço extremo", "alto risco"],

    # BAIXO RISCO
    ["leve incômodo nas costas", "baixo risco"],
    ["cansaço leve após caminhar", "baixo risco"],
    ["fadiga leve durante o dia", "baixo risco"],
    ["leve dor de cabeça ao acordar", "baixo risco"],
    ["coceira leve nas mãos", "baixo risco"],
    ["desconforto abdominal leve", "baixo risco"],
    ["leve dor nas articulações", "baixo risco"],
    ["inchaço leve nos pés", "baixo risco"],
    ["me sinto cansado mas consigo realizar atividades normais", "baixo risco"],
    ["leve desconforto abdominal após refeição", "baixo risco"],
    ["leve dor nas costas ao sentar", "baixo risco"],
    ["fadiga leve após atividades normais", "baixo risco"],
    ["coceira e vermelhidão leve na pele", "baixo risco"],
    ["cansaço normal após atividades", "baixo risco"],
    ["leve desconforto no pescoço", "baixo risco"],
    ["leve incômodo no ombro", "baixo risco"],
    ["sonolência durante o dia", "baixo risco"],
    ["cansaço moderado após exercícios leves", "baixo risco"],
    ["leve dor de cabeça e cansaço", "baixo risco"],
    ["me sinto cansado, mas nada grave", "baixo risco"],

    # VARIAÇÕES ADICIONAIS (mistura de expressões)
    ["sinto aperto no peito e mal consigo respirar", "alto risco"],
    ["batimentos cardíacos acelerados e tontura", "alto risco"],
    ["dor no peito e suor frio repentino", "alto risco"],
    ["leve dor de estômago depois da refeição", "baixo risco"],
    ["cansaço leve e sono durante o dia", "baixo risco"],
    ["palpitações ocasionais, mas sem dor", "baixo risco"],
    ["dor no peito acompanhada de fraqueza", "alto risco"],
    ["tontura leve ao levantar da cama", "baixo risco"],
    ["falta de ar súbita e ansiedade", "alto risco"],
    ["desconforto leve no peito, sem outros sintomas", "baixo risco"],
    ["dor intensa no peito e falta de ar", "alto risco"],
    ["cansaço após subir escadas", "baixo risco"],
    ["suor frio e dor no peito ao esforço", "alto risco"],
    ["leve incômodo abdominal e fadiga", "baixo risco"],
    ["palpitações com tontura e sensação de desmaio", "alto risco"],
    ["fadiga moderada, consigo realizar tarefas", "baixo risco"],
    ["dor no peito acompanhada de náusea e tontura", "alto risco"],
    ["leve desconforto nas costas e cansaço", "baixo risco"],
    ["batimentos irregulares e falta de ar", "alto risco"],
    ["leve coceira e vermelhidão na pele", "baixo risco"],
    ["dor intensa no peito com tontura e suor frio", "alto risco"],
    ["cansaço leve durante atividades diárias", "baixo risco"]
]

# Criar DataFrame e salvar
df = pd.DataFrame(dados, columns=["frase", "situacao"])
csv_path = "frases_risco_expandido.csv"
df.to_csv(csv_path, index=False, encoding="utf-8-sig")

csv_path
