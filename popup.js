
const API_KEY = "AIzaSyD-TyxeUph5lJp4YgdGrS7cWiFBvTG97Z0";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

let uploadedDocument = null;

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById("file-input");
    const sendButton = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");

    // File upload handling
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadedDocument = null; // Reset previous document
            const reader = new FileReader();
            
            reader.onload = (event) => {
                uploadedDocument = event.target.result;
                showFileInfo(file.name);
                addMessage('system', 'Document uploaded successfully!');
            };
            
            reader.readAsText(file);
        }
    });

    // Send message on button click or Enter key
    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});

function showFileInfo(fileName) {
    const fileInfo = document.getElementById("file-info");
    fileInfo.innerHTML = `
        <span>${fileName}</span>
        <button class="remove-file" onclick="removeFile()">×</button>
    `;
    fileInfo.className = "file-info show";
}

function removeFile() {
    uploadedDocument = null;
    document.getElementById("file-input").value = "";
    document.getElementById("file-info").className = "file-info";
    addMessage('system', 'Document removed');
}

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const userText = inputField.value.trim();
    
    if (!userText) return;

    addMessage('user', userText);
    inputField.value = "";

    try {
        const prompt = uploadedDocument 
            ? `Context from uploaded document: ${uploadedDocument}\n\nUser question: ${userText}`
            : userText;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process your request.";
        addMessage('bot', botReply);
    } catch (error) {
        addMessage('bot', 'Error retrieving response.');
    }
}

function addMessage(type, text) {
    const chatBox = document.getElementById("chat-box");
    const div = document.createElement("div");
    div.className = `${type}-message`;
    div.innerHTML = `<b>${type === 'user' ? 'You' : type === 'system' ? 'System' : 'Bot'}:</b> ${text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}
