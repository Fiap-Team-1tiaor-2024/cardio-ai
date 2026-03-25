const API = "http://127.0.0.1:8000";

const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");
const statusText = document.getElementById("statusText");
const newChatBtn = document.getElementById("newChatBtn");

let sessionId = null;
let sending = false;

// Hora
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

function setStatus(text) {
  statusText.textContent = text;
}

// Mensagem
function addMessage(text, sender = "bot", isTyping = false) {
  const row = document.createElement("div");
  row.className = `message-row ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = `message ${sender}`;

  const textDiv = document.createElement("div");
  textDiv.className = "message-text";
  textDiv.innerHTML = text;

  if (isTyping) {
    textDiv.classList.add("typing");
  }

  const timeDiv = document.createElement("div");
  timeDiv.className = "message-time";
  timeDiv.textContent = getCurrentTime();

  bubble.appendChild(textDiv);
  bubble.appendChild(timeDiv);
  row.appendChild(bubble);
  chat.appendChild(row);

  scrollToBottom();
  return row;
}

// Digitando
function addTypingIndicator() {
  const typingRow = addMessage("Assistente digitando...", "bot", true);
  typingRow.id = "typing-indicator";
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

// Botões
function showOptions(options) {
  const row = document.createElement("div");
  row.className = "message-row bot";

  const bubble = document.createElement("div");
  bubble.className = "message bot";

  const wrap = document.createElement("div");
  wrap.className = "options-wrap";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt.label;

    btn.onclick = () => {
      console.log("CLICOU OPÇÃO:", opt.value.input.text);
      sendMessage(opt.value.input.text);
    };

    wrap.appendChild(btn);
  });

  bubble.appendChild(wrap);
  row.appendChild(bubble);
  chat.appendChild(row);

  scrollToBottom();
}

// Criar sessão
async function createSession() {
  try {
    setStatus("Conectando...");

    const res = await fetch(`${API}/session`);
    const data = await res.json();

    console.log("SESSION RESPONSE:", data);

    sessionId = data.session_id;

    console.log("SESSION ID SALVA:", sessionId);

    setStatus("Online");
  } catch (error) {
    console.error(error);
    setStatus("Erro na conexão");
    addMessage("Não foi possível conectar ao assistente.");
  }
}

// Resposta Watson
function handleResponse(data) {
  const generic = data?.output?.generic || [];

  if (generic.length === 0) {
    addMessage("Sem resposta do assistente.");
    return;
  }

  generic.forEach(item => {
    if (item.response_type === "text") {
      addMessage(item.text, "bot");
    }

    if (item.response_type === "option") {
      showOptions(item.options);
    }
  });
}

// Enviar mensagem
async function sendMessage(text) {
  if (!text || !sessionId || sending) return;

  console.log("ENVIANDO sessionId:", sessionId);

  sending = true;
  addMessage(text, "user");
  addTypingIndicator();

  try {
    const res = await fetch(`${API}/mensagem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text,
        sessionId: sessionId,
        userId: "cardio-user"
      })
    });

    removeTypingIndicator();

    if (!res.ok) {
      throw new Error("Erro na requisição");
    }

    const data = await res.json();
    handleResponse(data);

  } catch (error) {
    console.error(error);
    removeTypingIndicator();
    addMessage("Erro ao falar com o assistente.");
  } finally {
    sending = false;
    input.focus();
  }
}

// Reset
function resetChat() {
  chat.innerHTML = "";
  addMessage("Olá! Eu sou o CardioIA. Como posso ajudar?", "bot");
}

// Eventos
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  sendMessage(text);
});

newChatBtn.addEventListener("click", async () => {
  sessionId = null;
  resetChat();
  await createSession();
});

// Inicialização
(async function init() {
  resetChat();
  await createSession();
})();