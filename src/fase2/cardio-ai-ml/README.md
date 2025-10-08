# Extração de Informações e Classificação de Texto

Esta fase marca o início da aplicação prática de Inteligência Artificial no projeto **CardiolA**.

O objetivo foi desenvolver um sistema simples, porém funcional, capaz de interpretar frases médicas simuladas, identificar sintomas e classificar o nível de risco do paciente — reproduzindo a lógica de triagem clínica presente em sistemas reais de apoio ao diagnóstico.  

---

## 📂 Estrutura do Projeto

```
src/
│
├── dados/
│ ├── diagnostico_sugeridos.csv # Frases e diagnósticos sugeridos
│ ├── frase_risco_expandido.csv # Frases rotuladas com nível de risco (alto/baixo)
│ ├── mapa_sintoma_doencas.csv # Associação entre sintomas e doenças
│ └── relatorios_pacientes.txt # Frases simuladas de pacientes
│
├── risco/
│ ├── risco_classificacao.py # Classificação textual de frases de risco
│ └── risco_predicao.py # Predição do nível de risco com ML (TF-IDF + modelo)
│
└── sintomas/
├── sintomas_classificacao.py # Extração de sintomas e associação com doenças
└── sintomas_predicao.py # Diagnóstico sugerido com base nas frases

```

---

## 🧠 Objetivo Geral  

Demonstrar como **dados textuais estruturados** podem ser utilizados por **modelos simples de IA** para simular diagnósticos médicos automáticos.  
Nesta entrega, a equipe construiu:  

- Um **mapeamento de sintomas e doenças** baseado em frases reais simuladas;  
- Um **classificador de risco textual** usando técnicas de NLP (TF-IDF + modelo supervisionado);  
- Um **pipeline de predição** que une leitura de frases, análise sintática e sugestão de diagnóstico.  

---

## 🩹 Parte 1 – Identificação de Sintomas  

### Origem dos Dados  
O arquivo `mapa_sintoma_doencas.csv` contém o relacionamento entre expressões comuns (ex.: “dor no peito”, “falta de ar”) e doenças associadas (ex.: Infarto, Angina, Arritmia).  
Os sintomas foram baseados em bases públicas de saúde (PAHO, WHO, Einstein, Ministério da Saúde) e adaptados para simular relatos reais.  

### Como podem ser explorados em IA  
- Extração automática de sintomas em textos médicos;  
- Associação semântica entre sintomas e doenças;  
- Criação de bases de conhecimento para triagem digital.  

### Relevância  
Esse tipo de estrutura é o ponto de partida para sistemas de apoio ao diagnóstico, que utilizam NLP para identificar padrões clínicos e sugerir possíveis doenças com base em relatos de pacientes.  

---

## ⚠️ Parte 2 – Classificação de Risco  

### Origem dos Dados  
O arquivo `frase_risco_expandido.csv` contém frases simuladas rotuladas como **“baixo risco”** ou **“alto risco”**.  
Esses dados foram elaborados manualmente para representar diferentes níveis de gravidade relatados pelos pacientes.  

### Como podem ser explorados em IA  
- Vetorização das frases usando **TF-IDF**;  
- Treinamento de um modelo de **Machine Learning supervisionado** (ex.: Decision Tree, Logistic Regression);  
- Predição de risco em novas frases.  

### Relevância  
A classificação automática de risco é uma aplicação real de IA em triagens clínicas — ela permite priorizar pacientes críticos, reduzindo o tempo de resposta em atendimentos emergenciais.  

---

## 🧩 Funcionamento Geral do Sistema  

1. **Entrada:** frases de pacientes simulados (arquivo `.txt` ou listas internas nos scripts).  
2. **Processamento:** extração de sintomas e aplicação do modelo de risco.  
3. **Saída:** sugestão de diagnóstico e nível de risco associado.  

> 🔹 Exemplo de saída simulada:  
> ```
> Frase: "Sinto dor no peito e falta de ar ao subir escadas."
> Sintoma identificado: dor no peito, falta de ar
> Diagnóstico sugerido: Infarto
> Classificação de risco: Alto risco
> ```

---

## ⚙️ Tecnologias Utilizadas  

- **Python 3.11+**  
- **Pandas** – leitura e manipulação dos dados  
- **Scikit-learn** – TF-IDF, classificação e métricas de acurácia  
- **Numpy** – apoio em cálculos matriciais  
- **NLP básico (TF-IDF)** – representação vetorial das frases  

---

## 📊 Resultados e Insights  

- O modelo foi capaz de identificar corretamente a maioria das frases de alto risco baseadas em padrões linguísticos (ex.: “dor no peito”, “falta de ar”).  
- Mesmo com uma base pequena e simulada, o sistema reproduziu a lógica de decisão de uma triagem clínica.  
- A estrutura criada servirá como base para **modelos mais robustos nas próximas fases** (como redes neurais e processamento de linguagem natural avançado).  

---

## 🧱 Próximos Passos  

- Integrar o modelo de texto com **a interface Next.js** desenvolvida como extra.  
- Aperfeiçoar o classificador com técnicas de **embedding (Word2Vec ou BERT)**.  
- Unificar o diagnóstico textual com o **diagnóstico visual (CNN)** em uma única API.  

---

## 🔗 Complementos Extras  

🔸 **Frontend (Next.js):** interface experimental para entrada de sintomas e visualização dos resultados.  
🔸 **Diagnóstico Visual:** módulo adicional que aplica redes neurais (MLP) para análise de imagens médicas, ampliando o escopo multimodal do projeto.  