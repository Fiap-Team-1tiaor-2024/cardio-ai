# Classificação de ECG com Imagens e MLP

Este projeto realiza a classificação de sinais eletrocardiográficos (ECG) utilizando uma abordagem visual: os sinais são convertidos em imagens e processados por uma rede neural do tipo MLP (Perceptron Multicamadas).

## 🧠 Objetivo

Transformar sinais de ECG em imagens, pré-processá-las e treinar um modelo de aprendizado profundo para distinguir entre batimentos normais e anômalos.

## 📂 Etapas do Pipeline

### 1. 📈 Geração de Imagens

- Os arquivos `ptbdb_abnormal.csv` e `ptbdb_normal.csv` são carregados.
- Cada linha representa um sinal de ECG com um rótulo (0 = normal, 1 = anômalo).
- Os sinais são convertidos em imagens `.png` e salvos nas pastas (*a /imagem pasta é criada ao rodar o código):
  - `src/imagem/normal/`
  - `src/imagem/anomaly/`

### 2. 🧼 Pré-processamento

- As imagens são carregadas em escala de cinza e redimensionadas para `64x64`.
- São normalizadas e vetorizadas para entrada no modelo MLP.
- Labels são atribuídos conforme a pasta de origem.

### 3. 🧪 Treinamento do Modelo

- Os dados são divididos em treino e teste (80/20).
- Um modelo MLP é definido com:
  - Camadas densas: 256 → 128 → 1
  - Ativação: ReLU nas ocultas, Sigmoid na saída
- Métrica de avaliação: acurácia
- O desempenho é visualizado com gráficos de acurácia por época.

## 🛠️ Tecnologias Utilizadas

- Python 3.10+
- Pandas, NumPy, Matplotlib
- OpenCV (cv2)
- Scikit-learn
- TensorFlow / Keras

## 📊 Dataset

- [ECG Heartbeat Categorization Dataset](https://www.kaggle.com/datasets/shayanfazeli/heartbeat)
- Os arquivos `.csv` devem estar na pasta src/dados:
  - `ptbdb_normal.csv`
  - `ptbdb_abnormal.csv`

 🚀 Como executar o projeto
1. Instalar as dependências
  - `pip -r install requirements.txt`

2. Executar o script principal
Na pasta do projeto, rode:
  - `python main.py`
