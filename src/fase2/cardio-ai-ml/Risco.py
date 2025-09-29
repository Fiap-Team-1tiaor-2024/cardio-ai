import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Ler CSV expandido
df = pd.read_csv("frases_risco_expandido.csv")

# Features e labels
X = df["frase"]
y = df["situacao"]

# TF-IDF
vectorizer = TfidfVectorizer()
X_vect = vectorizer.fit_transform(X)

# Dividir treino/teste
X_train, X_test, y_train, y_test = train_test_split(X_vect, y, test_size=0.2, random_state=42)

# Treinar modelo
clf = LogisticRegression(max_iter=1000)
clf.fit(X_train, y_train)

# Testar modelo
y_pred = clf.predict(X_test)

# Avaliação
print("Acurácia:", accuracy_score(y_test, y_pred))
print("\nRelatório de classificação:\n", classification_report(y_test, y_pred))

# Testar com novas frases
novas_frases = [
    "sinto dor no peito e suor frio",
    "leve desconforto na barriga",
    "falta de ar e tontura repentina",
    "me sinto cansado, mas nada grave",
    "batimentos cardíacos acelerados e suor frio",
    "leve dor de cabeça e cansaço"
]

novas_vect = vectorizer.transform(novas_frases)
predicoes = clf.predict(novas_vect)

for frase, pred in zip(novas_frases, predicoes):
    print(f"Frase: {frase} → Risco: {pred}")
