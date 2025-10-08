import pandas as pd
import os

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DADOS_DIR = os.path.join(BASE_DIR, "..", "dados")
csv_path = os.path.join(DADOS_DIR, "frases_risco_expandido.csv")

df = pd.read_csv(csv_path)


# Features e labels
X = df["frase"]
y = df["situacao"]

# TF-IDF
vectorizer = TfidfVectorizer()
X_vect = vectorizer.fit_transform(X)

# Dividir treino/teste
X_train, X_test, y_train, y_test = train_test_split(
    X_vect, y, test_size=0.2, random_state=42
)

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
    "leve dor de cabeça e cansaço",
    "meu coração dispara de repente quando estou em repouso",
    "sinto dor de cabeça forte acompanhada de visão turva",
    "fico com os pés e tornozelos inchados no fim do dia",
    "meus lábios ficam arroxeados após esforço físico",
    "acordei no meio da noite sem conseguir respirar direito",
]

novas_vect = vectorizer.transform(novas_frases)
predicoes = clf.predict(novas_vect)

for frase, pred in zip(novas_frases, predicoes):
    print(f"Frase: {frase} → Risco: {pred}")
