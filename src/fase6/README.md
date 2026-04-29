# 🫀 CardioAI – Sistema Preditivo Multiagente para Eventos Cardíacos

Projeto desenvolvido para a **Fase 6** da graduação em Inteligência Artificial para Devs – FIAP.

O sistema combina um modelo de Machine Learning supervisionado com uma arquitetura multiagente customizada, capaz de prever riscos cardíacos e recomendar protocolos clínicos de forma automatizada e colaborativa entre agentes especializados.

---

## 🎥 Vídeo de Demonstração
[Link do vídeo](https://youtu.be/6uRws88MWXM)

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Parte 1 – Modelo Preditivo](#parte-1--modelo-preditivo)
- [Parte 2 – Sistema Multiagente](#parte-2--sistema-multiagente)
- [Explicação Técnica: Handoffs e Tools](#explicação-técnica-handoffs-e-tools)
- [Exemplo Real de Execução](#exemplo-real-de-execução)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

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
│       ├── tools.py                 # Tools (calcular_risco, consultar_protocolos)
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
│  Orquestrador   │  ← ponto de entrada
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

#### 🎯 Agente Orquestrador
- **Responsabilidade:** Ponto de entrada do sistema
- **Entrada:** JSON com dados clínicos do paciente
- **Ação:** Delega ao Analista de Risco via handoff
- **Formatação:** Utiliza Gemini para formatar a resposta final em texto legível

#### 🔍 Agente Analista de Risco
- **Responsabilidade:** Calcular probabilidade de risco cardíaco
- **Entrada:** Dados clínicos do paciente
- **Tool utilizada:** `calcular_risco_cardiaco`
- **Saída:** `RiskScore` (probabilidade + classificação)
- **Ação:** Faz handoff para o Especialista em Protocolos

#### 📋 Agente Especialista em Protocolos
- **Responsabilidade:** Recomendar protocolos clínicos
- **Entrada:** Classificação de risco do Analista
- **Tools utilizadas:** 
  - `consultar_protocolos` – busca protocolos na base
  - `gerar_recomendacao_final` – monta recomendação estruturada
- **Saída:** `RecomendacaoFinal` validada com Pydantic

---

## Explicação Técnica: Handoffs e Tools

### Arquitetura de Handoffs

Este projeto implementa uma **arquitetura multiagente customizada** utilizando classes Python e transferência de contexto entre agentes. O mecanismo de **handoff** permite que cada agente delegue a execução para o próximo, passando os dados processados.

#### Fluxo de Transferência de Contexto

```
┌──────────────┐    dados_paciente     ┌──────────────┐
│              │ ──────────────────────►│              │
│ Orquestrador │                        │   Analista   │
│              │                        │              │
└──────────────┘                        └──────┬───────┘
                                               │
                                               │ RiskScore
                                               ▼
                                        ┌──────────────┐
                                        │              │
                                        │ Especialista │
                                        │              │
                                        └──────────────┘
```

**Exemplo de implementação de handoff:**

```python
class OrquestradorAgent:
    def processar(self, dados_paciente):
        # Delega para o Analista
        risk_score = self.analista.analisar(dados_paciente)
        
        # Delega para o Especialista
        recomendacao = self.especialista.recomendar(risk_score)
        
        return recomendacao
```

---

### Tools Implementadas

As tools são funções especializadas que executam tarefas específicas. Cada tool possui entrada tipada (Pydantic), processamento interno e saída estruturada.

#### 1️⃣ `calcular_risco_cardiaco`

**Propósito:** Calcular a probabilidade de risco cardíaco usando o modelo treinado

**Entrada (DadosPaciente):**
```python
{
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
    "pulse_pressure": 50
}
```

**Processamento:**
1. Valida se todos os campos de `FEATURE_NAMES` estão presentes
2. Converte o dict para array NumPy na ordem correta das features
3. Carrega o modelo `.pkl` usando `joblib.load()`
4. Executa `model.predict_proba()` para obter probabilidade da classe positiva
5. Classifica: `probabilidade >= 0.5` → "ALTO RISCO", caso contrário → "BAIXO RISCO"

**Saída (RiskScore):**
```python
RiskScore(
    probabilidade=0.6734,
    classificacao="ALTO RISCO",
    probabilidade_pct="67.34%"
)
```

**Código simplificado:**
```python
def calcular_risco_cardiaco(dados: DadosPaciente) -> RiskScore:
    # Carrega modelo
    model = joblib.load("artifacts/modelo_risco_cardiaco.pkl")
    
    # Prepara features
    features = [dados.dict()[f] for f in FEATURE_NAMES]
    X = np.array(features).reshape(1, -1)
    
    # Predição
    prob = model.predict_proba(X)[0][1]
    classificacao = "ALTO RISCO" if prob >= 0.5 else "BAIXO RISCO"
    
    return RiskScore(
        probabilidade=prob,
        classificacao=classificacao,
        probabilidade_pct=f"{prob*100:.2f}%"
    )
```

---

#### 2️⃣ `consultar_protocolos`

**Propósito:** Buscar protocolos clínicos recomendados com base no nível de risco

**Entrada:** String de classificação (`"ALTO RISCO"` ou `"BAIXO RISCO"`)

**Base de Dados (PROTOCOLS_DB):**
```python
PROTOCOLS_DB = {
    "ALTO RISCO": {
        "protocolos": [
            "P-001: Encaminhamento imediato para cardiologista",
            "P-002: Monitoramento contínuo de pressão arterial (24h)",
            "P-003: ECG de repouso e de esforço",
            "P-004: Exames laboratoriais completos",
            "P-005: Avaliação medicamentosa especializada"
        ],
        "urgencia": "ALTA – Consulta em até 24 horas"
    },
    "BAIXO RISCO": {
        "protocolos": [
            "P-011: Consulta cardiológica de rotina anual",
            "P-012: Manutenção de hábitos saudáveis",
            "P-013: Monitoramento periódico da pressão arterial"
        ],
        "urgencia": "BAIXA – Acompanhamento preventivo"
    }
}
```

**Saída (ProtocoloSaida):**
```python
ProtocoloSaida(
    nivel="ALTO RISCO",
    protocolos=[
        "P-001: Encaminhamento imediato...",
        "P-002: Monitoramento contínuo...",
        ...
    ],
    urgencia="ALTA – Consulta em até 24 horas"
)
```

---

#### 3️⃣ `gerar_recomendacao_final`

**Propósito:** Combinar paciente, risco e protocolos em uma recomendação estruturada

**Entrada:**
- `nome_paciente`: String (ex: "Carlos, 52 anos")
- `risk_score`: Objeto `RiskScore`
- `protocolos`: Objeto `ProtocoloSaida`

**Saída (RecomendacaoFinal):**
```python
RecomendacaoFinal(
    paciente="Carlos, 52 anos",
    probabilidade_pct="67.34%",
    classificacao="ALTO RISCO",
    urgencia="ALTA – Consulta em até 24 horas",
    protocolos=[...],
    observacoes="Paciente apresenta combinação relevante de fatores..."
)
```

**Código simplificado:**
```python
def gerar_recomendacao_final(
    nome_paciente: str,
    risk_score: RiskScore,
    protocolos: ProtocoloSaida
) -> RecomendacaoFinal:
    
    obs = (
        "Paciente apresenta combinação relevante de fatores de risco. "
        "Recomendado acompanhamento prioritário."
        if risk_score.classificacao == "ALTO RISCO"
        else "Manter hábitos saudáveis e acompanhamento preventivo."
    )
    
    return RecomendacaoFinal(
        paciente=nome_paciente,
        probabilidade_pct=risk_score.probabilidade_pct,
        classificacao=risk_score.classificacao,
        urgencia=protocolos.urgencia,
        protocolos=protocolos.protocolos,
        observacoes=obs
    )
```

---

## Exemplo Real de Execução

### Entrada: JSON do Paciente

```json
{
    "nome": "Carlos, 52 anos",
    "dados_clinicos": {
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
        "pulse_pressure": 50
    }
}
```

### Saída: Terminal

```
============================================================
         CARDIO AI - SISTEMA PREDITIVO MULTIAGENTE
============================================================

Paciente       : Carlos, 52 anos
Probabilidade  : 67.34%
Classificação  : ALTO RISCO
Urgência       : ALTA – Consulta em até 24 horas

Protocolos sugeridos:
  • P-001: Encaminhamento imediato para cardiologista
  • P-002: Monitoramento contínuo de pressão arterial (24h)
  • P-003: ECG de repouso e de esforço
  • P-004: Exames laboratoriais completos
  • P-005: Avaliação medicamentosa especializada

Observações: Paciente apresenta combinação relevante de
fatores de risco. Recomendado acompanhamento prioritário.

============================================================
       Histórico do fluxo multiagente executado
============================================================
[ORQUESTRADOR] Recebeu dados do paciente
[ANALISTA]     Tool: calcular_risco_cardiaco → 67.34%
[ESPECIALISTA] Tool: consultar_protocolos → 5 protocolos
[ESPECIALISTA] Tool: gerar_recomendacao_final → Sucesso
[ORQUESTRADOR] Formatação final com Gemini → Concluída
============================================================
```

---

### Diagrama de Sequência Detalhado

```
USUÁRIO      ORQUESTRADOR    ANALISTA    ESPECIALISTA    GEMINI
   │               │             │             │            │
   │──(1)──────────►│             │             │            │
   │  Dados JSON   │             │             │            │
   │               │             │             │            │
   │               │──(2)────────►│             │            │
   │               │   handoff   │             │            │
   │               │             │             │            │
   │               │             │──(3)────────┐            │
   │               │             │   Tool:     │            │
   │               │             │   calcular_ │            │
   │               │             │   risco()   │            │
   │               │             │◄────────────┘            │
   │               │             │  RiskScore  │            │
   │               │             │             │            │
   │               │◄────(4)─────│             │            │
   │               │  RiskScore  │             │            │
   │               │             │             │            │
   │               │──(5)────────────────────►│            │
   │               │         handoff          │            │
   │               │                          │            │
   │               │                          │──(6)───────┐
   │               │                          │   Tool:    │
   │               │                          │   consultar│
   │               │                          │   _protoc()│
   │               │                          │◄───────────┘
   │               │                          │            │
   │               │                          │──(7)───────┐
   │               │                          │   Tool:    │
   │               │                          │   gerar_   │
   │               │                          │   rec()    │
   │               │                          │◄───────────┘
   │               │                          │            │
   │               │◄────(8)──────────────────│            │
   │               │    RecomendacaoFinal     │            │
   │               │                          │            │
   │               │──(9)──────────────────────────────────►│
   │               │         formatação                     │
   │               │◄────(10)──────────────────────────────│
   │               │        texto final                     │
   │               │                          │            │
   │◄──(11)────────│                          │            │
      resposta     │                          │            │
```

**Legenda:**
1. Usuário envia dados clínicos do paciente
2. Orquestrador → Analista (handoff com dados_paciente)
3. Analista executa tool `calcular_risco_cardiaco`
4. RiskScore retornado ao Orquestrador
5. Orquestrador → Especialista (handoff com RiskScore)
6. Especialista executa tool `consultar_protocolos`
7. Especialista executa tool `gerar_recomendacao_final`
8. RecomendacaoFinal retornada ao Orquestrador
9. Orquestrador envia para Gemini formatar
10. Texto formatado retornado
11. Resposta final apresentada ao usuário

---

## Instalação

### Pré-requisitos

- Python 3.12+
- Conta no Kaggle (para download do dataset)
- Chave de API da OpenAI (para integração com Gemini)

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd cardio-ai/src/fase6
```

### 2. Instale as dependências

```bash
pip install numpy pandas polars pyarrow scikit-learn matplotlib seaborn joblib pydantic openai
```

### 3. Baixe o dataset

Acesse https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset, baixe o arquivo `cardio_train.csv` e coloque em:

```
fase6/dataset/cardio_train.csv
```

### 4. Configure a chave da OpenAI

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
python main_multiagent.py
```

O script irá acionar o pipeline multiagente e exibir a recomendação final no terminal.

---

## Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| `scikit-learn` | Treinamento, avaliação e inferência do modelo |
| `GradientBoostingClassifier` | Algoritmo de classificação supervisionada |
| `GridSearchCV` | Otimização de hiperparâmetros com validação cruzada |
| `polars` | Manipulação eficiente de dados |
| `joblib` | Serialização do modelo treinado |
| `pydantic` | Validação de schemas de entrada e saída |
| `openai` | Integração com Gemini para formatação de texto |
| `matplotlib` / `seaborn` | Visualizações e gráficos |

---

> 💡 Este projeto tem fins acadêmicos. As recomendações geradas são baseadas em dados sintéticos e **não substituem orientação médica profissional**.