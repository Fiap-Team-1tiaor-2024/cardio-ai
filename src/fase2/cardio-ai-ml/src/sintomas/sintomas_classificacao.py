import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Caminho correto para a pasta de dados (um nível acima)
DADOS_DIR = os.path.join(BASE_DIR, "..", "dados")
os.makedirs(DADOS_DIR, exist_ok=True)  # garante que a pasta exista

# Novo conjunto de relatos de pacientes (20 frases)
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
    "Nos últimos três dias senti o coração disparar de repente, sem motivo aparente.",
    "Ontem tive uma dor de cabeça muito forte na nuca junto com visão turva.",
    "Nos últimos dias percebi que meus lábios ficam arroxeados quando faço esforço físico.",
    "Perdi a força no braço direito de repente e tive dificuldade para falar.",
    "Tenho acordado à noite com tosse seca e sensação de sufocamento.",
    "Sinto febre baixa constante acompanhada de suor em excesso à noite.",
    "Meu coração parece falhar batidas, principalmente quando estou deitado.",
    "Sinto dor no peito quando caminho rápido, mas ela melhora quando descanso.",
    "Notei inchaço na barriga e nas pernas que não melhora mesmo com repouso.",
    "Nos últimos meses tenho tido muito cansaço e emagrecimento sem explicação.",
    "Já desmaiei duas vezes nos últimos dias sem motivo aparente.",
]

# Salvar relatos em .txt (na pasta src/dados)
caminho_relatos = os.path.join(DADOS_DIR, "relatos_pacientes.txt")
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
    ["ansiedade", "sensação de morte iminente", "Infarto"],
    ["perda de visão em um ou ambos os olhos", "dificuldade na fala", "Cerebrovascular"],
    ["dor de cabeça súbita e intensa", "formigamento ou fraqueza súbita em um lado do corpo", "Cerebrovascular"],
    ["confusão mental súbita", "fala arrastada", "Cerebrovascular"],
    ["coloração roxa ou azulada na pele", "respiração rápida e curta mesmo em repouso", "Cardiopatia Congênita"],
    ["coração acelerado", "boca roxa após esforço físico", "Cardiopatia Congênita"],
    ["infecções respiratórias frequentes", "palidez e apatia", "Cardiopatia Congênita"],
    ["inchaço nas pernas, barriga ou ao redor dos olhos", "baixo ganho de peso", "Cardiopatia Congênita"],
    ["sonolência excessiva", "cansaço excessivo", "Cardiopatia Congênita"],
    ["febre persistente", "suor em excesso", "Endocardite"],
    ["presença de sangue na urina", "perda de peso", "Endocardite"],
    ["dores nas articulações e no músculo", "inchaço nos pés, pernas ou barriga", "Endocardite"],
    ["sopro cardíaco", "dispneia", "Endocardite"],
    ["dor no peito ao esforço emocional", "desconforto torácico sob estresse", "Angina"],
    ["dor que melhora com repouso", "desconforto ao esforço e alívio ao descanso", "Angina"],
    ["tosse persistente", "chiado no peito", "Insuficiência Cardíaca"],
    ["tosse noturna", "secreção rosada", "Insuficiência Cardíaca"],
    ["pressão muito alta súbita", "crise hipertensiva", "Hipertensão"],
    ["dor occipital", "rigidez na nuca com pressão alta", "Hipertensão"],
    ["formigamento no braço direito", "fraqueza súbita em um lado do corpo", "Cerebrovascular"],
    ["dificuldade de compreender palavras", "alterações na fala", "Cerebrovascular"],
    ["desmaio súbito", "perda breve de consciência", "Arritmia"],
    ["batimentos irregulares à noite", "sensação de falha no coração", "Arritmia"],
    ["cianose nos lábios", "coloração azulada nas unhas", "Cardiopatia Congênita"],
    ["dificuldade de ganhar peso desde o nascimento", "baixo desenvolvimento físico", "Cardiopatia Congênita"],
    ["febre intermitente", "suor noturno", "Endocardite"],
    ["pontos vermelhos na pele (petéquias)", "manchas roxas inexplicáveis", "Endocardite"],
    ["fadiga constante com perda de apetite", "emagrecimento progressivo", "Endocardite"],
]

# Criar DataFrame e salvar como CSV
df_mapa = pd.DataFrame(mapa_dados, columns=["Sintoma 1", "Sintoma 2", "Doença Associada"])
caminho_mapa = os.path.join(DADOS_DIR, "mapa_sintomas_doencas.csv")

df_mapa.to_csv(caminho_mapa, index=False, encoding="utf-8-sig")

var = caminho_relatos, caminho_mapa

print("Arquivos relatos_pacientes.txt e mapa_sintomas_doencas.csv criados com sucesso!")