# 📊 Fase 1 – Batalhamento de Dados: Mapeando o Coração Moderno

Nesta primeira fase do projeto **CardiolA**, o objetivo é **consolidar e organizar diferentes tipos de dados cardiológicos** para servir de base ao desenvolvimento das fases seguintes.  

Aqui reunimos três categorias de dados:  
- **Numéricos (IoT)**: variáveis clínicas de pacientes.  
- **Textuais (NLP)**: artigos e conteúdos institucionais sobre doenças cardiovasculares.  
- **Visuais (Visão Computacional)**: exames cardiológicos em formato de imagens.  

Essa etapa é fundamental, pois estabelece o **alicerce da plataforma de IA**, garantindo qualidade, diversidade e confiabilidade das informações que serão processadas pelos algoritmos.


## 📂 Estrutura dos Dados

```
src/
└── assets/
  ├── dataset (csv)/ # Dados numéricos
  ├── articles/ # Textos (.txt com links de artigos)
  └── images/ # Links de repositórios de imagens
```

## 📊 Parte 1 – Dados Numéricos (IoT)

- **Fonte do dataset**: [Cardiovascular Disease Dataset – Kaggle](https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset/data)  

### Descrição
O dataset contém informações clínicas reais e anonimizadas de pacientes, coletadas em exames médicos.
São mais de 70 mil registros com variáveis como idade, sexo, pressão arterial, colesterol, glicemia, IMC, hábitos de vida e histórico de doenças cardiovasculares.

### Variáveis mais relevantes
- **Idade** – fator de risco primário para doenças cardiovasculares.
- **Pressão arterial sistólica e diastólica** – indicadores de hipertensão, uma das principais causas de eventos cardíacos.
- **Colesterol total** – diretamente associado a doenças como aterosclerose.
- **IMC (Índice de Massa Corporal)** – ligado à obesidade, que aumenta risco de doenças cardíacas.
- **Histórico de doenças cardiovasculares** – variável clínica essencial para análise preditiva.
- **Frequência cardíaca** – pode indicar arritmias e outros distúrbios cardíacos.

### Relevância para IA

Essas variáveis permitem a criação de modelos preditivos (classificação e regressão) capazes de identificar pacientes de risco, prever crises e apoiar decisões médicas.



## 📄 Parte 2 – Dados Textuais (NLP)

- **Arquivos armazenados em**: `src/assets/articles/`  
- **Exemplos de fontes**:  
  - [OMS – Fact Sheet](https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds))  
  - [OPAS – Doenças Cardiovasculares](https://www.paho.org/pt/topicos/doencas-cardiovasculares)  

### Origem dos Dados
Foram coletados textos institucionais e científicos no formato .txt contendo links e resumos sobre:

- Doenças cardiovasculares;
- Sintomas;
- Estratégias de prevenção.

### Como podem ser explorados em NLP
- Extração de sintomas a partir de descrições médicas.
- Classificação de tópicos (prevenção, diagnóstico, tratamento).
- Análise de sentimentos em conteúdos de conscientização pública.

### Relevância para IA
A análise textual permite criar assistentes virtuais ou chatbots cardiológicos capazes de interagir com pacientes, responder dúvidas e oferecer recomendações baseadas em informações científicas confiáveis.


## 🖼️ Parte 3 – Dados Visuais (Visão Computacional)

- **Fonte do dataset**: [ECG Images Dataset – Kaggle](https://www.kaggle.com/datasets/jayaprakashpondy/ecgimages/data)  

### Origem dos Dados
O dataset contém imagens de eletrocardiogramas (ECGs) classificados em diferentes categorias (normal, arritmia, etc.), totalizando mais de 100 registros.

### Como podem ser explorados em Visão Computacional
- Detecção de padrões em sinais elétricos do coração.
- Identificação de anomalias como arritmias e bloqueios cardíacos.
- Classificação automática de exames entre normais e patológicos.

### Relevância para IA
A análise de exames por algoritmos de visão computacional pode auxiliar médicos no diagnóstico precoce, reduzindo erros e acelerando a triagem de pacientes.


## ✅ Conclusão da Fase 1

A Fase 1 consolidou dados **numéricos, textuais e visuais**, garantindo uma base estruturada para as fases seguintes.  
Essa etapa é crucial, pois os algoritmos de IA só são tão bons quanto os dados que os alimentam.  

Próxima etapa → **Fase 2 – Diagnóstico Automatizado: IA no Estetoscópio Digital**
