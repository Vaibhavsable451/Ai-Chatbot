// API Key is now handled by the backend server
const Api_Key = "";
const Api_Url = window.API_CONFIG ?.ENDPOINTS ?.CHAT || "/api/chat";

// DOM Elements
const chatContainer = document.querySelector("#chat-container");
const promptInput = document.querySelector("#prompt");
const submitBtn = document.querySelector("#submit");
const micBtn = document.querySelector("#micBtn");
const stopBtn = document.querySelector("#stopBtn");
const fileInput = document.querySelector("#fileInput");
const filePreview = document.querySelector("#filePreview");
const pdfViewer = document.getElementById("pdfViewer");
const pdfFrame = document.getElementById("pdfFrame");
const closeModal = document.querySelector(".close");
const themeSelector = document.querySelector("#themeSelector");

// Sidebar Elements
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const newChatBtn = document.getElementById("newChatBtn");
const searchChatsInput = document.getElementById("searchChats");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const logoutBtn = document.getElementById("logoutBtn");

// State
let user = {
    message: null,
    files: [],
    fileContext: ""
};
let abortController = null;
let isSpeaking = false;
let chats = [];
let currentChatId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    setupTheme();
    setupMarkdown();
    loadChats();
    setupSidebarListeners();
});

// --- Chat Management Functions ---

function loadChats() {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
        chats = JSON.parse(savedChats);
        const lastChatId = localStorage.getItem('currentChatId');
        if (lastChatId && chats.find(c => c.id === lastChatId)) {
            loadChat(lastChatId);
        } else {
            createNewChat();
        }
    } else {
        createNewChat();
    }
    renderHistoryList();
}

function saveChats() {
    localStorage.setItem('chats', JSON.stringify(chats));
}

function createNewChat() {
    stopOngoingActions();
    const id = Date.now().toString();
    const newChat = {
        id: id,
        title: "New Chat",
        timestamp: Date.now(),
        messages: []
    };
    chats.unshift(newChat);
    currentChatId = id;
    localStorage.setItem('currentChatId', currentChatId);
    saveChats();

    // Clear UI
    chatContainer.innerHTML = '';
    promptInput.value = '';
    filePreview.innerHTML = '';
    user.files = [];
    user.fileContext = "";

    // Rerender list to show new chat at top
    renderHistoryList();

    // On mobile, close sidebar after creating new chat
    if (window.innerWidth <= 768) {
        sidebar.classList.remove("open");
    }
}

function loadChat(id) {
    const chat = chats.find(c => c.id === id);
    if (!chat) return;

    stopOngoingActions();
    currentChatId = id;
    localStorage.setItem('currentChatId', currentChatId);

    // Clear UI
    chatContainer.innerHTML = '';

    // Render Messages
    chat.messages.forEach(msg => {
        const isUser = msg.role === 'user';
        const className = isUser ? 'user-chat-box' : 'ai-chat-box';
        const img = isUser ? 'user.png' : 'ai.png';

        let contentHtml = '';
        if (isUser) {
            contentHtml = `<div class="user-chat-area">
                ${msg.text ? `<div>${msg.text}</div>` : ""}
                <div class="timestamp">${msg.timestamp || ''}</div>
            </div>`;
        } else {
            contentHtml = `<div class="ai-chat-area">
                <div class="ai-response">${marked.parse(msg.text)}</div>
            </div>`;
        }

        const html = `
            <img src="${img}" width="${isUser ? '8%' : '10%'}" />
            ${contentHtml}
        `;

        const div = createChatBox(html, className);
        chatContainer.appendChild(div);

        // Add controls for AI messages
        if (!isUser) {
            const textArea = div.querySelector(".ai-chat-area");
            addControlsToResponse(textArea, msg.text);
        }
    });

    hljs.highlightAll();
    scrollToBottom();
    renderHistoryList();

    // Mobile close trigger
    if (window.innerWidth <= 768) {
        sidebar.classList.remove("open");
    }
}

function addMessageToState(role, text) {
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) return;

    chat.messages.push({
        role: role,
        text: text,
        timestamp: getCurrentTimestamp()
    });

    // Update title if it's the first message and it's user
    if (role === 'user' && chat.messages.length === 1) {
        chat.title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
    }

    // Move chat to top
    chats = chats.filter(c => c.id !== currentChatId);
    chats.unshift(chat);

    saveChats();
    renderHistoryList();
}

function deleteHistory() {
    if (confirm("Are you sure you want to delete all chat history?")) {
        stopOngoingActions();
        chats = [];
        localStorage.removeItem('chats');
        localStorage.removeItem('currentChatId');
        createNewChat();
    }
}

function renderHistoryList() {
    const filter = searchChatsInput.value.toLowerCase();
    historyList.innerHTML = '';

    chats.forEach(chat => {
        if (chat.title.toLowerCase().includes(filter)) {
            const div = document.createElement('div');
            div.className = `history-item ${chat.id === currentChatId ? 'active' : ''}`;
            div.innerHTML = `<i class="far fa-comment-alt"></i> <span>${chat.title}</span>`;
            div.onclick = () => loadChat(chat.id);
            historyList.appendChild(div);
        }
    });
}

function setupSidebarListeners() {
    newChatBtn.addEventListener('click', createNewChat);
    clearHistoryBtn.addEventListener('click', deleteHistory);

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // localStorage.clear(); // Maybe don't clear history if they want to keep it?
            // User requested "logout" which usually implies clearing session. 
            // But preserving history might be nice. Current logic clears everything.
            localStorage.clear();
            window.location.href = "login.html";
        });
    }

    if (searchChatsInput) {
        searchChatsInput.addEventListener('input', renderHistoryList);
    }

    // Mobile Sidebar Toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// --- Existing Logic Updated ---

// Markdown & Highlight.js Setup
function setupMarkdown() {
    marked.setOptions({
        highlight: function(code, lang) {
            const language = highlight.getLanguage(lang) ? lang : 'plaintext';
            return highlight.highlight(code, {
                language
            }).value;
        },
        langPrefix: 'hljs language-'
    });
}

// Theme Handling
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeSelector.value = savedTheme;

    themeSelector.addEventListener('change', (e) => {
        const newTheme = e.target.value;
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function stopOngoingActions() {
    if (abortController) {
        abortController.abort();
        abortController = null;
    }
    window.speechSynthesis.cancel();
    isSpeaking = false;
    // Reset UI buttons if needed
    stopBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
}

function createChatBox(html, className) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(className);
    return div;
}

function getCurrentTimestamp() {
    return new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Voice Input
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    micBtn.addEventListener('click', () => {
        if (micBtn.classList.contains('recording')) recognition.stop();
        else recognition.start();
    });

    recognition.onstart = () => micBtn.classList.add('recording');
    recognition.onend = () => micBtn.classList.remove('recording');
    recognition.onresult = (event) => {
        promptInput.value += event.results[0][0].transcript;
    };
} else {
    micBtn.style.display = 'none';
}

// Text to Speech
function speakText(text) {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => isSpeaking = false;
    isSpeaking = true;
    window.speechSynthesis.speak(utterance);
}

// PDF Text Extraction
async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
    }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += `Page ${i}: ` + textContent.items.map(item => item.str).join(" ") + "\n";
    }
    return fullText;
}

// Streaming Response
async function generateResponse(aiChatBox) {
    let textArea = aiChatBox.querySelector(".ai-chat-area");
    let responseContent = "";

    submitBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');

    abortController = new AbortController();

    let finalMessage = user.message;
    if (user.fileContext) finalMessage += `\n\nContext:\n${user.fileContext}`;

    const requestBody = {
        model: "llama-3.1-8b-instant",
        messages: [{
                role: "system",
                content: "You are a helpful AI assistant."
            },
            {
                role: "user",
                content: finalMessage
            }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: true
    };

    // IMAGE VISION SUPPORT
    const imageFile = user.files.find(f => f.type.startsWith('image/'));
    if (imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1];
            requestBody.messages[1].content = [{
                    type: "text",
                    text: finalMessage
                },
                {
                    type: "image_url",
                    image_url: {
                        url: `data:image/jpeg;base64,${base64Image}`
                    }
                }
            ];
            requestBody.model = "llama-3.2-11b-vision-preview";
            await fetchAndStream(requestBody, textArea, aiChatBox, responseContent);
        };
    } else {
        await fetchAndStream(requestBody, textArea, aiChatBox, responseContent);
    }
}

async function fetchAndStream(requestBody, textArea, aiChatBox, responseContent) {
    let responseDiv;

    try {
        console.log("Sending request to:", Api_Url);
        const response = await fetch(Api_Url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            signal: abortController.signal
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Details:", response.status, errorText);
            throw new Error(`API Error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        textArea.innerHTML = '<div class="ai-response"></div>';
        responseDiv = textArea.querySelector('.ai-response');

        while (true) {
            const {
                done,
                value
            } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, {
                stream: true
            });
            const lines = chunk.split("\n");

            for (const line of lines) {
                if (line.startsWith("data: ") && line !== "data: [DONE]") {
                    try {
                        const json = JSON.parse(line.substring(6));
                        const content = json.choices[0].delta.content || "";
                        responseContent += content;
                        responseDiv.innerHTML = marked.parse(responseContent);
                        hljs.highlightAll();
                        scrollToBottom();
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }

        addControlsToResponse(textArea, responseContent);

        // SAVE AI RESPONSE
        addMessageToState('assistant', responseContent);

        // AUTO-SPEAK
        if (responseContent.trim()) {
            speakText(responseContent);
        }

    } catch (error) {
        console.error("Stream Error:", error);
        if (responseDiv) {
            responseDiv.innerHTML += "<div style='color:red'>Error occurred</div>";
        }
    } finally {
        stopBtn.classList.add("hidden");
        submitBtn.classList.remove("hidden");
        user.files = [];
        user.fileContext = "";
        filePreview.innerHTML = "";
        abortController = null;
    }
}

function addControlsToResponse(textArea, text) {
    // Only add if not already there
    if (textArea.querySelector(".controls")) return;

    const controlsHtml = `
        <div class="controls">
            <button class="control-btn" onclick="copyText(this)"><i class="fas fa-copy"></i></button>
            <button class="control-btn" onclick="speakText(\`${text.replace(/`/g, "\\`")}\`)"><i class="fas fa-volume-up"></i></button>
        </div>
        <div class="timestamp">${getCurrentTimestamp()}</div>
    `;
    textArea.insertAdjacentHTML("beforeend", controlsHtml);
}

window.copyText = function(btn) {
    const text = btn.closest(".ai-chat-area").querySelector(".ai-response").innerText;
    navigator.clipboard.writeText(text);
};

// Send Message
submitBtn.addEventListener("click", async () => {
    const text = promptInput.value.trim();
    if (!text && user.files.length === 0) return;

    user.message = text;
    user.fileContext = "";

    // Add User Message to State
    addMessageToState('user', text);

    const pdfFiles = user.files.filter(f => f.type === "application/pdf");
    for (const file of pdfFiles) {
        const pdfText = await extractTextFromPDF(file);
        user.fileContext += `\n--- ${file.name} ---\n${pdfText}\n`;
    }

    // IMAGE PREVIEW IN CHAT
    let filePreviews = '';
    if (user.files.length > 0) {
        filePreviews = user.files.map(file => {
            if (file.type.startsWith('image/')) {
                return `<img src="${URL.createObjectURL(file)}" class="chat-image" alt="${file.name}" style="max-width: 300px; border-radius: 8px; margin-top: 8px;" />`;
            } else if (file.type === 'application/pdf') {
                return `<div class="pdf-preview" onclick="openPDF('${URL.createObjectURL(file)}')" style="cursor: pointer; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; margin-top: 8px;"><i class="fas fa-file-pdf"></i> ${file.name}</div>`;
            }
            return '';
        }).join('');
    }

    const userHtml = `
        <img src="user.png" width="8%" />
        <div class="user-chat-area">
            ${text ? `<div>${text}</div>` : ""}
            ${filePreviews}
            <div class="timestamp">${getCurrentTimestamp()}</div>
        </div>
    `;
    chatContainer.appendChild(createChatBox(userHtml, "user-chat-box"));

    promptInput.value = "";
    scrollToBottom();

    const aiHtml = `
        <img src="ai.png" width="10%" />
        <div class="ai-chat-area">
            <div class="ai-response"><img src="loading.gif" width="40px" /></div>
        </div>
    `;
    const aiChatBox = createChatBox(aiHtml, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);

    scrollToBottom();
    await generateResponse(aiChatBox);
});

// Enter Key Send
promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitBtn.click();
});

// Stop Button
stopBtn.addEventListener("click", () => {
    if (abortController) abortController.abort();
    window.speechSynthesis.cancel();
    isSpeaking = false;
});

// File Preview
fileInput.addEventListener("change", (e) => {
    user.files = Array.from(e.target.files);
    filePreview.innerHTML = user.files.map(file => `
        <div class="file-item">${file.name}</div>
    `).join('');
});

// PDF Modal
window.openPDF = function(pdfUrl) {
    pdfFrame.src = pdfUrl;
    pdfViewer.style.display = "block";
};

closeModal.onclick = function() {
    pdfViewer.style.display = "none";
    pdfFrame.src = "";
};
