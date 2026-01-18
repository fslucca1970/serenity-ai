// script.js

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput   = document.getElementById('user-input');
    const sendButton  = document.getElementById('send-button');
    const resetButton = document.getElementById('reset-button');

    // -------------------------------------------------
    // Função auxiliar: adiciona uma mensagem ao chat
    // -------------------------------------------------
    function addMessage(sender, message, extraClass = '') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        if (sender === 'user') {
            messageDiv.classList.add('user-message');
            messageDiv.innerHTML = `<strong>Você:</strong> ${message}`;
        } else {
            messageDiv.classList.add('ai-message');
            // extraClass permite, por exemplo, aplicar o estilo “meditando”
            if (extraClass) messageDiv.classList.add(extraClass);
            messageDiv.innerHTML = `<strong>Serenity AI:</strong> ${message}`;
        }
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // rola para a última mensagem
        return messageDiv; // devolve o elemento para que possamos removê‑lo depois
    }

    // -------------------------------------------------
    // Envia a mensagem do usuário e aguarda a resposta
    // -------------------------------------------------
    async function sendMessage() {
        const text = userInput.value.trim();
        if (text === '') return;

        // 1️⃣ Mensagem do usuário
        addMessage('user', text);
        userInput.value = ''; // limpa o campo

        // 2️⃣ Mensagem “meditando…” (placeholder)
        const placeholder = addMessage('ai', 'meditando…', 'meditando');

        try {
            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            // 3️⃣ Remove o placeholder e insere a resposta real
            placeholder.remove();
            addMessage('ai', data.response);
        } catch (err) {
            console.error('Erro ao enviar mensagem:', err);
            placeholder.remove(); // garante que o placeholder não fique pendente
            addMessage('ai',
                'Desculpe, não consegui me conectar ao Serenity AI. Por favor, tente novamente mais tarde.'
            );
        }
    }

    // -------------------------------------------------
    // Reinicia a conversa (mantém a mensagem inicial da IA)
    // -------------------------------------------------
    async function resetConversation() {
        chatMessages.innerHTML = `
            <div class="message ai-message">
                <strong>Serenity AI:</strong> Olá! Eu sou Serenity AI, seu monge digital. Como posso ajudá-lo a encontrar a paz hoje?
            </div>
        `;
        userInput.value = '';

        try {
            await fetch('http://127.0.0.1:5000/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            console.error('Erro ao reiniciar conversa:', err);
            addMessage('ai',
                'Desculpe, não consegui reiniciar a conversa. Por favor, tente novamente.'
            );
        }
    }

    // -------------------------------------------------
    // Eventos de UI
    // -------------------------------------------------
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // impede quebra de linha
            sendMessage();
        }
    });
    resetButton.addEventListener('click', resetConversation);
});
