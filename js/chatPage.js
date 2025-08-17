
const sendBtn = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const quickOptions = document.querySelectorAll(".option-pill");
const chatListContainer = document.querySelector(".chat-history");

const LS_KEY = 'ai_chat_chats_n8n_v2';
let selectedIA = null;
let isTyping = false;
let currentChatId = null;

// ========== Storage ==========
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("No se pudo leer localStorage", e);
    return [];
  }
}

function saveToStorage(chats) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(chats));
  } catch (e) {
    console.warn("No se pudo guardar en localStorage", e);
  }
}

function getChats() {
  return loadFromStorage();
}

function setChats(chats) {
  saveToStorage(chats);
}

function pushMessage(chatId, role, content) {
  const chats = getChats();
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  chat.messages.push({
    role,
    content,
    at: new Date().toISOString()
  });

  chat.updatedAt = new Date().toISOString();
  setChats(chats);
}

function generateTitle(content) {
  return content.split(/\s+/).slice(0, 6).join(" ").substring(0, 48);
}

// ========== UI ==========
function appendMessage(role, content) {
  const wrapper = document.createElement("div");
  wrapper.className = "message " + (role === "user" ? "user" : "assistant");
  const avatar = role === "user" ? "K" : "🤖";

  wrapper.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      ${escapeHtml(content)}
      <div class="message-time">${new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</div>
    </div>
  `;
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function showTyping() {
  isTyping = true;
  const indicator = document.getElementById("typingIndicator");
  indicator?.classList.add("active");
  sendBtn.disabled = true;
}

function hideTyping() {
  isTyping = false;
  const indicator = document.getElementById("typingIndicator");
  indicator?.classList.remove("active");
  sendBtn.disabled = false;
}

function startNewChat(iaCode, title = "Nuevo Chat") {
  const chats = getChats();
  const id = crypto.randomUUID();
  const newChat = {
    id,
    ia: iaCode,
    title,
    updatedAt: new Date().toISOString(),
    messages: []
  };
  chats.unshift(newChat);
  setChats(chats);
  currentChatId = id;

  chatMessages.innerHTML = "";
  renderChatList();
  chatMessages.style.display = "flex";
  document.getElementById("welcomeScreen")?.style?.setProperty("display", "none");
}

function renderChatList() {
  const chats = getChats();
  chatListContainer.innerHTML = "";
  chats.forEach((c) => {
    const item = document.createElement("div");
    item.className = "chat-item" + (c.id === currentChatId ? " active" : "");
    item.onclick = () => loadChat(c.id);
    item.innerHTML = `
      <div class="chat-time">${new Date(c.updatedAt).toLocaleDateString()}</div>
      <div class="chat-title">${escapeHtml(c.title)}</div>
      <div class="chat-preview">${escapeHtml((c.messages.at(-1)?.content || "").slice(0, 50))}</div>
    `;
    chatListContainer.appendChild(item);
  });
}

function loadChat(id) {
  const chats = getChats();
  const chat = chats.find(c => c.id === id);
  if (!chat) return;

  currentChatId = id;
  chatMessages.innerHTML = "";
  chat.messages.forEach(msg => {
    appendMessage(msg.role, msg.content);
  });

  renderChatList();
  chatMessages.style.display = "flex";
  document.getElementById("welcomeScreen")?.style?.setProperty("display", "none");
}

// ========== Acción ==========
async function sendMessageToN8N() {
  const text = messageInput.value.trim();
  if (!text || !selectedIA || isTyping) return;

  if (!currentChatId) {
    startNewChat(selectedIA, generateTitle(text));
  // Actualizar título del chat después de creación
  const chats = getChats();
  const chat = chats.find(c => c.id === currentChatId);
  if (chat) {
    chat.title = generateTitle(text);
    setChats(chats);
    renderChatList();
  }
  }

  appendMessage("user", text);
  pushMessage(currentChatId, "user", text);
  messageInput.value = "";
  showTyping();

  try {
    
    const n8nURL = "https://n8n.srv884321.hstgr.cloud/webhook/chatbot-multi-ia";
    const res = await fetch(n8nURL, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        ia: selectedIA,
        action: "message"
      })
    });

    if (!res.ok) {
      throw new Error("Respuesta no válida de N8N: " + res.status);
    }
    const data = await res.json();
    const reply = data.response || "Sin respuesta";
    appendMessage("assistant", reply);
    pushMessage(currentChatId, "assistant", reply);
  } catch (e) {
    appendMessage("assistant", "❌ Error al conectar con la IA.");
    pushMessage(currentChatId, "assistant", "Error técnico");
    console.error("Error al conectar con N8N:", e);
  } finally {
    hideTyping();
    renderChatList();
  }
}

// ========== Eventos ==========
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessageToN8N();
  }
});

sendBtn?.addEventListener("click", sendMessageToN8N);

quickOptions.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;
    selectedIA = value;

    // Bloqueo por opción 1
    if (value === "1") {
      quickOptions.forEach(b => {
        if (b !== btn) {
          b.disabled = true;
          b.classList.remove("is-selected");
        }
      });
    } else {
      const ia1 = document.querySelector('[data-value="1"]');
      if (ia1) ia1.disabled = false;
    }

    quickOptions.forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
  });
});

// ========== Inicialización ==========
document.addEventListener("DOMContentLoaded", () => {
  renderChatList();
});
