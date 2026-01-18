      // script.js

    document.addEventListener('DOMContentLoaded', () => {
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        const resetButton = document.getElementById('reset-button');

        // Função para adicionar uma mensagem ao chat
        function addMessage(sender, message) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            if (sender === 'user') {
                messageDiv.classList.add('user-message');
                messageDiv.innerHTML = `<strong>Você:</strong> ${message}`;
            } else {
                messageDiv.classList.add('ai-message');
                messageDiv.innerHTML = `<strong>Serenity AI:</strong> ${message}`;
            }
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para a última mensagem
        }

        // Função para enviar mensagem
        async function sendMessage() {
            const message = userInput.value.trim();
            if (message === '') return;

            addMessage('user', message);
            userInput.value = ''; // Limpa o input

            try {
                const response = await fetch('http://127.0.0.1:5000/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: message })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                addMessage('ai', data.response);
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                addMessage('ai', 'Desculpe, não consegui me conectar ao Serenity AI. Por favor, tente novamente mais tarde.');
            }
        }

        // Função para reiniciar a conversa
        async function resetConversation() {
            // Limpa as mensagens visíveis no chat, exceto a inicial da IA
            chatMessages.innerHTML = `
                <div class="message ai-message">
                    <strong>Serenity AI:</strong> Olá! Eu sou Serenity AI, seu monge digital. Como posso ajudá-lo a encontrar a paz hoje?
                </div>
            `;
            userInput.value = ''; // Limpa o input

            try {
                const response = await fetch('http://127.0.0.1:5000/reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Opcional: Adicionar uma mensagem de confirmação de reset
                // addMessage('ai', 'Conversa reiniciada. Como posso ajudar agora?');

            } catch (error) {
                console.error('Erro ao reiniciar conversa:', error);
                addMessage('ai', 'Desculpe, não consegui reiniciar a conversa. Por favor, tente novamente.');
            }
        }

        // Event Listeners
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { // Envia ao pressionar Enter, mas não Shift+Enter
                e.preventDefault(); // Previne quebra de linha no input
                sendMessage();
            }
        });
        resetButton.addEventListener('click', resetConversation);
    });

