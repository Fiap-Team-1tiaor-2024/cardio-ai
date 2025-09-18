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

### Origem dos Dados
Foram utilizados três conjuntos de imagens médicas complementares:  

1. **ECG Images Dataset – Kaggle**  
   [Link](https://www.kaggle.com/datasets/jayaprakashpondy/ecgimages/data)  
   Contém imagens de eletrocardiogramas (ECGs) classificados em diferentes categorias (normal, arritmia, etc.), com mais de 100 registros.  

2. **Raio-X de Doenças Pulmonares – Kaggle**  
   [Link](https://www.kaggle.com/datasets/alexsanderlindolfo/raio-x-de-doenas-pulmonares-completo)  
   Conjunto de exames de raio-X torácico, úteis para identificar doenças pulmonares que impactam indiretamente o sistema cardiovascular.  

3. **Annotated X-Ray Angiography Dataset – Kaggle**  
   [Link](https://www.kaggle.com/datasets/nikitamanaenkov/annotated-x-ray-angiography-dataset)  
   Contém imagens de angiografia anotadas, diretamente relacionadas à detecção de obstruções e anomalias nos vasos coronários.  

---

### Como podem ser explorados em Visão Computacional
- Detecção de padrões em ECGs e angiogramas.  
- Identificação de anomalias como arritmias, bloqueios cardíacos e obstruções coronárias.  
- Estudo do impacto indireto de doenças pulmonares sobre o coração.  
- Classificação automática de exames entre normais e patológicos.  

---

### Relevância para IA
O uso de múltiplos exames visuais permite enriquecer os modelos de IA com dados complementares:  
- **ECG** → capta sinais elétricos do coração.  
- **Raio-X** → auxilia na análise de condições pulmonares que afetam o sistema cardiovascular.  
- **Angiografia** → detecta diretamente obstruções nas artérias coronárias, principal causa de infarto.  

Essa diversidade de dados melhora a robustez dos algoritmos, possibilitando diagnósticos mais completos e suporte eficiente na tomada de decisão médica.


## ✅ Conclusão da Fase 1

A Fase 1 consolidou dados **numéricos, textuais e visuais**, garantindo uma base estruturada para as fases seguintes.  
Essa etapa é crucial, pois os algoritmos de IA só são tão bons quanto os dados que os alimentam.  

Próxima etapa → **Fase 2 – Diagnóstico Automatizado: IA no Estetoscópio Digital**
