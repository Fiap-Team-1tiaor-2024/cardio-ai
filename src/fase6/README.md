# 🫀 CardioAI – Sistema Preditivo Multiagente para Eventos Cardíacos

Projeto desenvolvido para a **Fase 6** da graduação em Inteligência Artificial para Devs – FIAP.

O sistema combina um modelo de Machine Learning supervisionado com uma arquitetura multiagente baseada no **OpenAI Agents SDK**, capaz de prever riscos cardíacos e recomendar protocolos clínicos de forma automatizada e colaborativa entre agentes especializados.

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Parte 1 – Modelo Preditivo](#parte-1--modelo-preditivo)
- [Parte 2 – Sistema Multiagente](#parte-2--sistema-multiagente)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Equipe](#equipe)

---

## Visão Geral

O **CardioAI** é um pipeline inteligente dividido em duas partes:

| Parte | Descrição |
|-------|-----------|
| **Parte 1** | Treinamento e avaliação de um modelo de Gradient Boosting para prever pico de risco cardíaco |
| **Parte 2** | Sistema Multiagente com 3 agentes especializados que colaboram para analisar o risco e recomendar protocolos clínicos |

---

## Estrutura do Projeto

```
fase6/
├── main.py                          # Parte 1 – Pipeline de treinamento
├── main_multiagent.py               # Parte 2 – Sistema Multiagente
│
├── cardio_ai_model/
│   ├── __init__.py
│   ├── config/
│   │   ├── __init__.py
│   │   └── config.py                # Configurações e FEATURE_NAMES
│   ├── datapipeline/
│   │   ├── __init__.py
│   │   ├── analysis.py              # Heatmap e importância de features
│   │   ├── data_pipeline.py         # Carga, limpeza e engenharia de features
│   │   ├── evaluation.py            # Métricas, curva ROC, matriz de confusão
│   │   ├── inference.py             # Predição para novos pacientes
│   │   └── persistence.py           # Salvamento do modelo
│   ├── training/
│   │   ├── __init__.py
│   │   └── training.py              # Treinamento com GridSearchCV
│   └── agents/
│       ├── __init__.py
│       ├── schemas.py               # Schemas Pydantic
│       ├── protocols.py             # Base de protocolos clínicos
│       ├── analyst.py               # Agente Analista de Risco
│       ├── specialist.py            # Agente Especialista em Protocolos
│       └── orchestrator.py          # Agente Orquestrador
│
├── artifacts/
│   └── modelo_risco_cardiaco.pkl    # Modelo treinado (gerado pela Parte 1)
│
└── dataset/
    └── cardio_train.csv             # Dataset cardiovascular (Kaggle)
```

---

## Parte 1 – Modelo Preditivo

### Dataset

Base de dados cardiovascular pública disponível no Kaggle:  
👉 https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset

Contém ~70.000 registros com variáveis clínicas como pressão arterial, colesterol, IMC, idade e hábitos de vida. A variável alvo é `cardio` (renomeada para `peak_risk`), indicando presença ou ausência de evento cardiovascular.

### Pipeline de Treinamento

1. **Carregamento** – leitura do CSV com separador `;`
2. **Transformação base** – conversão de idade para anos, renomeação de colunas
3. **Limpeza de outliers clínicos** – filtros em pressão arterial, altura e peso
4. **Engenharia de features** – cálculo de IMC e pressão de pulso
5. **Divisão treino/teste** – 80/20 com estratificação
6. **Treinamento** – `GradientBoostingClassifier` com `GridSearchCV` (5-fold, scoring F1)
7. **Avaliação** – acurácia, relatório de classificação, matriz de confusão, curva ROC/AUC
8. **Persistência** – modelo salvo em `artifacts/modelo_risco_cardiaco.pkl`

### Features Utilizadas

| Feature | Descrição |
|---------|-----------|
| `gender` | Gênero (1=feminino, 2=masculino) |
| `height` | Altura (cm) |
| `weight` | Peso (kg) |
| `ap_hi` | Pressão sistólica |
| `ap_lo` | Pressão diastólica |
| `cholesterol` | Colesterol (1=normal, 2=acima, 3=muito acima) |
| `gluc` | Glicose (1=normal, 2=acima, 3=muito acima) |
| `smoke` | Fumante (0/1) |
| `alco` | Consumo de álcool (0/1) |
| `active` | Atividade física (0/1) |
| `age_years` | Idade em anos |
| `imc` | Índice de Massa Corporal (calculado) |
| `pulse_pressure` | Pressão de pulso = ap_hi - ap_lo (calculado) |

---

## Parte 2 – Sistema Multiagente

### Arquitetura

```
Usuário
   │
   ▼
┌─────────────────┐
│   Orquestrador  │  ← ponto de entrada
└────────┬────────┘
         │ handoff
         ▼
┌─────────────────────────┐
│   Analista de Risco     │  ← tool: calcular_risco_cardiaco
└────────────┬────────────┘
             │ handoff
             ▼
┌──────────────────────────────┐
│  Especialista em Protocolos  │  ← tools: consultar_protocolos
│                              │           gerar_recomendacao_final
└──────────────────────────────┘
             │
             ▼
     Recomendação Final
```

### Agentes

#### 🔍 Agente Analista de Risco
- Recebe os dados clínicos do paciente em JSON
- Chama a tool `calcular_risco_cardiaco` que carrega o modelo `.pkl` e retorna a probabilidade
- Classifica o risco em **ALTO**, **MODERADO** ou **BAIXO**
- Faz handoff para o Agente Especialista em Protocolos

#### 📋 Agente Especialista em Protocolos
- Recebe a classificação de risco
- Chama a tool `consultar_protocolos` para buscar na base simulada
- Chama a tool `gerar_recomendacao_final` para montar a resposta estruturada
- Valida o schema de saída com Pydantic

#### 🎯 Agente Orquestrador
- Ponto de entrada do sistema
- Recebe os dados do paciente e delega ao Analista de Risco via handoff
- Coordena o fluxo completo

### Exemplo de Saída

```
============================================================
    RECOMENDACAO CARDIO AI - SISTEMA MULTIAGENTE
============================================================
Paciente          : Carlos, 52 anos
Probabilidade     : 67.34%
Classificacao     : RISCO MODERADO
Urgencia          : MODERADA – Consulta em ate 7 dias

Protocolos Sugeridos:
  - P-006: Agendamento de consulta cardiologica em ate 7 dias
  - P-007: Monitoramento semanal de pressao arterial
  - P-008: Orientacao nutricional e controle de peso
  - P-009: Programa de atividade fisica supervisionada
  - P-010: Reavaliacao laboratorial em 30 dias

Observacoes: Paciente possui fatores de risco controlados,
mas exige acompanhamento preventivo estruturado.
============================================================
```

---

## Instalação

### Pré-requisitos

- Python 3.12+
- Conta no Kaggle (para download do dataset)
- Chave de API da OpenAI (para a Parte 2)

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd cardio-ai/src/fase6
```

### 2. Instale as dependências

```bash
pip install numpy pandas polars pyarrow scikit-learn matplotlib seaborn joblib openai-agents pydantic
```

### 3. Baixe o dataset

Acesse https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset, baixe o arquivo `cardio_train.csv` e coloque em:

```
fase6/dataset/cardio_train.csv
```

### 4. Configure a chave da OpenAI (apenas para Parte 2)

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-..."
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY="sk-..."
```

---

## Como Executar

### Parte 1 – Treinamento do modelo

```bash
python main.py
```

O script irá:
- Carregar e limpar os dados
- Treinar o modelo com GridSearchCV
- Exibir métricas, matriz de confusão e curva ROC
- Salvar o modelo em `artifacts/modelo_risco_cardiaco.pkl`

### Parte 2 – Sistema Multiagente

> ⚠️ Execute a Parte 1 antes para gerar o modelo.

```bash
python main_parte2.py
```

O script irá acionar o pipeline multiagente para dois pacientes de exemplo (Carlos e Ana) e exibir a recomendação final no terminal.

---

## Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| `scikit-learn` | Treinamento, avaliação e inferência do modelo |
| `GradientBoostingClassifier` | Algoritmo de classificação supervisionada |
| `GridSearchCV` | Otimização de hiperparâmetros com validação cruzada |
| `polars` | Manipulação eficiente de dados |
| `joblib` | Serialização do modelo treinado |
| `openai-agents` | Framework multiagente com handoffs e tools |
| `pydantic` | Validação de schemas de entrada e saída |
| `matplotlib` / `seaborn` | Visualizações e gráficos |

---



> 💡 Este projeto tem fins acadêmicos. As recomendações geradas são baseadas em dados sintéticos e **não substituem orientação médica profissional**.
