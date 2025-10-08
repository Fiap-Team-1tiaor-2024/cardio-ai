import os
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import cv2
import numpy as np

from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential  # type: ignore
from tensorflow.keras.layers import Dense  # type: ignore

matplotlib.use('Agg')

# ============================
# 1. Gerar imagens a partir dos CSVs
# ============================

# Caminho base: o diretório onde o main.py está
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DADOS_DIR = os.path.join(BASE_DIR, "dados")
IMAGEM_DIR = os.path.join(BASE_DIR, "imagem")

# Criar diretórios de imagem
os.makedirs(os.path.join(IMAGEM_DIR, "normal"), exist_ok=True)
os.makedirs(os.path.join(IMAGEM_DIR, "anomaly"), exist_ok=True)

# Função para gerar imagens de ECG
def gerar_imagens(df, offset=0):
    for i in range(len(df)):
        signal = df.iloc[i, :-1]
        label = df.iloc[i, -1]

        plt.figure(figsize=(2, 2))
        plt.plot(signal, color='black')
        plt.axis('off')

        folder = "normal" if label == 0 else "anomaly"
        filename = os.path.join(IMAGEM_DIR, folder, f"{i + offset}.png")
        plt.savefig(filename, bbox_inches='tight', pad_inches=0)
        plt.close()

# Carregar CSVs
df_abnormal = pd.read_csv(os.path.join(DADOS_DIR, "ptbdb_abnormal.csv"), header=None)
df_normal = pd.read_csv(os.path.join(DADOS_DIR, "ptbdb_normal.csv"), header=None)

# Gerar imagens
gerar_imagens(df_abnormal, offset=0)
gerar_imagens(df_normal, offset=len(df_abnormal))

print("✅ Imagens geradas com sucesso.")

# ============================
# 2. Pré-processar imagens
# ============================

img_size = (64, 64)
images = []
labels = []

def carregar_imagens(pasta, rotulo):
    for filename in os.listdir(pasta):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            caminho = os.path.join(pasta, filename)
            img = cv2.imread(caminho, cv2.IMREAD_GRAYSCALE)
            if img is not None:
                img = cv2.resize(img, img_size)
                images.append(img)
                labels.append(rotulo)

## Carregar imagens normais e anômalas
carregar_imagens(os.path.join(IMAGEM_DIR, "normal"), 0)
carregar_imagens(os.path.join(IMAGEM_DIR, "anomaly"), 1)

# Converter para arrays
X = np.array(images, dtype='float32') / 255.0
y = np.array(labels)

# Vetorizar para MLP
X = X.reshape(len(X), -1)

print("✅ Imagens carregadas e vetorizadas.")
print("Total de imagens:", len(X))
print("Formato de X:", X.shape)
print("Formato de y:", y.shape)

# ============================
# 3. Treinar MLP com Keras
# ============================

# Dividir em treino e teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Definir modelo
model = Sequential([
    Dense(256, activation='relu', input_shape=(X.shape[1],)),
    Dense(128, activation='relu'),
    Dense(1, activation='sigmoid')
])

# Compilar e treinar
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
history = model.fit(X_train, y_train, epochs=10, batch_size=32, validation_split=0.1)

# Avaliar
loss, accuracy = model.evaluate(X_test, y_test)
print(f"\n✅ Acurácia no teste: {accuracy:.2f}")

# Visualizar desempenho
plt.plot(history.history['accuracy'], label='Treino')
plt.plot(history.history['val_accuracy'], label='Validação')
plt.title('Acurácia por época')
plt.xlabel('Épocas')
plt.ylabel('Acurácia')
plt.legend()
plt.show()

plt.savefig(os.path.join(DADOS_DIR, "accuracy_plot.png"))
print("✅ Gráfico de acurácia salvo como accuracy_plot.png")