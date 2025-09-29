import pandas as pd

# Novo conjunto de relatos de pacientes (10 frases)
relatos = [
    "Há duas semanas sinto pressão no peito que piora quando subo escadas.",
    "Tenho percebido palpitações frequentes após as refeições, acompanhadas de tontura.",
    "Nos últimos dias sinto falta de ar mesmo quando estou em repouso.",
    "Notei que minhas pernas estão inchadas e pesadas desde a semana passada.",
    "Sinto dor no peito que irradia para o braço esquerdo desde ontem.",
    "Tenho tido dores de cabeça fortes junto com pressão arterial elevada.",
    "Acordo durante a noite com falta de ar e preciso sentar para respirar melhor.",
    "Sinto cansaço extremo ao realizar tarefas simples como varrer a casa.",
    "Percebo dor no peito em momentos de estresse, mesmo estando sentado.",
    "Nos últimos três dias senti o coração disparar de repente, sem motivo aparente."
]

# Salvar relatos em .txt
caminho_relatos =  "relatos_pacientes.txt"
with open(caminho_relatos, "w", encoding="utf-8") as f:
    for frase in relatos:
        f.write(frase + "\n")


# Mapa expandido de sintomas e doenças (com sinônimos)
mapa_dados = [
    ["dor no peito", "pressão no peito", "Infarto"],
    ["aperto no peito", "aperto no tórax", "Infarto"],
    ["dor irradiando para braço", "dor no ombro esquerdo", "Infarto"],
    ["dor subesternal", "peso no peito", "Infarto"],
    ["cansaço constante", "fadiga", "Insuficiência Cardíaca"],
    ["fraqueza geral", "exaustão", "Insuficiência Cardíaca"],
    ["cansaço ao esforço", "fadiga aos pequenos esforços", "Insuficiência Cardíaca"],
    ["falta de ar", "dificuldade para respirar", "Angina"],
    ["dispneia", "respiração curta", "Angina"],
    ["falta de ar ao deitar", "acordar sem ar", "Insuficiência Cardíaca"],
    ["falta de ar noturna", "ortopneia", "Insuficiência Cardíaca"],
    ["palpitações", "batimentos irregulares", "Arritmia"],
    ["coração disparado", "taquicardia súbita", "Arritmia"],
    ["batimentos acelerados", "arritmia percebida", "Arritmia"],
    ["tontura frequente", "desmaios", "Arritmia"],
    ["vertigem", "instabilidade ao andar", "Arritmia"],
    ["inchaço nas pernas", "edema nos tornozelos", "Insuficiência Cardíaca"],
    ["pernas pesadas", "inchaço abdominal", "Insuficiência Cardíaca"],
    ["retenção de líquidos", "aumento abdominal", "Insuficiência Cardíaca"],
    ["pressão alta", "hipertensão", "Hipertensão"],
    ["cefaleia intensa", "dores de cabeça fortes", "Hipertensão"],
    ["visão turva", "zumbido nos ouvidos", "Hipertensão"],
    ["pele fria e suada", "mal-estar súbito", "Infarto"],
    ["pressão no peito durante estresse", "dor no peito em repouso", "Angina"],
    ["dor ao esforço físico", "aperto no peito ao caminhar", "Angina"],
    ["cansaço após tarefas simples", "fraqueza aos esforços", "Insuficiência Cardíaca"],
    ["batimento lento", "bradicardia", "Arritmia"],
    ["palidez súbita", "fraqueza súbita", "Infarto"],
    ["ansiedade", "sensação de morte iminente", "Infarto"]
]

# Criar DataFrame e salvar como CSV
df_mapa = pd.DataFrame(mapa_dados, columns=["Sintoma 1", "Sintoma 2", "Doença Associada"])
caminho_mapa = "mapa_sintomas_doencas.csv"
df_mapa.to_csv(caminho_mapa, index=False, encoding="utf-8-sig")

var = caminho_relatos, caminho_mapa
