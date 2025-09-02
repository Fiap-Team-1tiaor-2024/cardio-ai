# 🫀 Projeto de Inteligência Artificial Aplicada às Doenças Cardiovasculares

Este repositório faz parte de um trabalho acadêmico que explora **dados cardiológicos** sob três diferentes perspectivas — **numérica (IoT)**, **textual (NLP)** e **visual (Visão Computacional)** — com o objetivo de construir uma base sólida para aplicações de **Inteligência Artificial** voltadas à área da saúde.

O projeto está dividido em três partes principais:

1. **Dados Numéricos (IoT)**;
2. **Dados Textuais (NLP)**;
3. **Dados Visuais (Visão Computacional)**.

## 📊 Parte 1 – Dados Numéricos (IoT)

- **Fonte do dataset**: [Cardiovascular Disease Dataset (Kaggle)](https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset/data)  

### 🔹 Origem dos Dados
O dataset contém informações clínicas **reais e anonimizadas** de pacientes, coletadas em exames médicos.  
São mais de 70 mil registros com variáveis como idade, sexo, pressão arterial, colesterol, glicemia, IMC, hábitos de vida e histórico de doenças cardiovasculares.

### 🔹 Variáveis Mais Relevantes (do ponto de vista clínico)
- **Idade** – fator de risco primário para doenças cardiovasculares.  
- **Pressão arterial sistólica e diastólica** – indicadores de hipertensão, uma das principais causas de eventos cardíacos.  
- **Colesterol total** – diretamente associado a doenças como aterosclerose.  
- **IMC (Índice de Massa Corporal)** – ligado à obesidade, que aumenta risco de doenças cardíacas.  
- **Histórico de doenças cardiovasculares** – variável clínica essencial para análise preditiva.  
- **Frequência cardíaca** – pode indicar arritmias e outros distúrbios cardíacos.  

### 🔹 Relevância para IA
Essas variáveis permitem a criação de **modelos preditivos** (classificação e regressão) capazes de identificar pacientes de risco, prever crises e apoiar decisões médicas.

## 📄 Parte 2 – Dados Textuais (NLP)

- **Fonte dos textos**: Artigos e conteúdos institucionais de órgãos como **OMS, OPAS, Gov.br, Einstein** e outros.  
- **Arquivos armazenados em**: `src/assets/articles/`  
- **Exemplo de fonte**:  
  - [OMS – Fact Sheet sobre Doenças Cardiovasculares](https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds))  
  - [OPAS – Doenças Cardiovasculares](https://www.paho.org/pt/topicos/doencas-cardiovasculares)  

### 🔹 Origem dos Dados
Foram coletados **textos institucionais e científicos** no formato `.txt` contendo links e resumos sobre:
- Doenças cardiovasculares;
- Sintomas;
- Estratégias de prevenção. 

### 🔹 Como podem ser explorados em NLP
- **Extração de sintomas** a partir de descrições médicas.  
- **Classificação de tópicos** (prevenção, diagnóstico, tratamento).  
- **Análise de sentimentos** em conteúdos de conscientização pública.  

### 🔹 Relevância para IA
A análise textual permite criar **assistentes virtuais** ou **chatbots cardiológicos** capazes de interagir com pacientes, responder dúvidas e oferecer recomendações baseadas em informações científicas confiáveis.


## 🖼️ Parte 3 – Dados Visuais (Visão Computacional)

- **Fonte do dataset**: [ECG Images Dataset (Kaggle)](https://www.kaggle.com/datasets/jayaprakashpondy/ecgimages/data)  


### 🔹 Origem dos Dados
O dataset contém **imagens de eletrocardiogramas (ECGs)** classificados em diferentes categorias (normal, arritmia, etc.), totalizando mais de 100 registros.

### 🔹 Como podem ser explorados em Visão Computacional
- **Detecção de padrões** em sinais elétricos do coração.  
- **Identificação de anomalias** como arritmias e bloqueios cardíacos.  
- **Classificação automática** de exames entre normais e patológicos.  

### 🔹 Relevância para IA
A análise de exames por algoritmos de visão computacional pode **auxiliar médicos** no diagnóstico precoce, reduzindo erros e acelerando a triagem de pacientes.

## ✅ Entregáveis

- [x] **Dataset numérico** em `.csv` na pasta `assets/dataset`  
- [x] **Arquivos textuais** em `.txt` na pasta `assets/articles`  
- [x] Link público para **imagens cardiológicas** em `assets/images`  
- [x] **README.md** detalhado com explicação, objetivos e fontes dos dados  

## 📌 Observação Final
Todos os dados utilizados neste projeto são de **acesso público** e/ou **simulados** para fins acadêmicos. Não há informações pessoais identificáveis.  

Este projeto tem caráter **educacional e científico**, voltado para a aplicação de **Inteligência Artificial em saúde**, com foco em **prevenção, diagnóstico e suporte clínico** para doenças cardiovasculares.