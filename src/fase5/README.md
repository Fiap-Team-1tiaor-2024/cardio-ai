
# 🫀 CardioIA — Assistente Cardiológico Conversacional

O **CardioIA** é um assistente conversacional desenvolvido com foco em saúde digital, capaz de interagir com usuários em linguagem natural para fornecer orientações iniciais e auxiliar no agendamento de exames.

Este projeto integra técnicas de **Processamento de Linguagem Natural (NLP)** com serviços de IA, backend em Python e uma interface web simples.

---

## 🚀 Objetivo

Simular um atendimento inicial em saúde por meio de um chatbot inteligente, respeitando limites éticos e técnicos, e aplicando conceitos de:

- NLP (Processamento de Linguagem Natural)
- Chatbots e Virtual Agents
- Integração com APIs
- Estruturação de fluxos conversacionais

---

## 🧠 Funcionalidades

- 💬 Interação em linguagem natural
- 📅 Agendamento de exames
- 🧾 Coleta de informações do usuário
- 🔘 Respostas com botões interativos
- 🔄 Manutenção de contexto via sessão
- ⚠️ Avisos éticos sobre uso do assistente

---

## 🏗️ Arquitetura do Projeto

O sistema é dividido em três camadas principais:

### 🔹 1. Watson Assistant
Responsável por:
- interpretação das mensagens (intents)
- reconhecimento de entidades
- controle do fluxo conversacional

---

### 🔹 2. Backend (FastAPI)
Responsável por:
- criação de sessão com o Watson
- envio de mensagens
- integração entre frontend e Watson
- controle de dados (ex: `user_id`)

Endpoints principais:

- `GET /session` → cria sessão
- `POST /mensagem` → envia mensagem

---

### 🔹 3. Frontend (Web)
Responsável por:
- interface de chat
- envio de mensagens
- exibição das respostas
- renderização de botões interativos

---

## 📁 Estrutura do Projeto
cardioia/
│
├── backend/
│ └── backend.py
│
├── frontend/
│ ├── index.html
│ ├── style.css
│ └── script.js
│
├── .env (não versionar)
└── README.md

🔄 Fluxo de Funcionamento
Usuário envia mensagem pelo frontend
Frontend chama o backend
Backend envia para o Watson Assistant
Watson processa via NLP
Resposta retorna estruturada
Frontend exibe ao usuário
⚠️ Considerações Éticas

Este assistente:

Não realiza diagnósticos médicos
Não substitui profissionais da saúde
Fornece apenas orientações iniciais
Incentiva a busca por atendimento médico
🎯 Resultados

O projeto demonstra na prática:

uso de IA conversacional em saúde
integração de sistemas via API
aplicação de NLP em cenários reais
construção de interfaces interativas
👨‍💻 Autores

Projeto acadêmico desenvolvido para disciplina de Inteligência Artificial / NLP / Chatbots.

📌 Observação

A API do Watson Assistant utilizada depende de credenciais válidas.
Caso ocorra erro de conexão, verifique:

API Key
Assistant ID
Environment ID
URL da instância
