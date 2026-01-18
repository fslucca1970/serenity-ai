    document.addEventListener('DOMContentLoaded', () => {
        const chatBox = document.getElementById('chat-box');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        const resetButton = document.getElementById('reset-button');

        // URL do seu backend Flask (certifique-se de que está rodando!)
        const API_BASE_URL = 'http://127.0.0.1:5000'; // Mantenha esta URL para testes locais

        // Função para adicionar mensagem ao chat
        function addMessage(sender, message) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', `${sender}-message`);
            messageDiv.textContent = message;
            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight; // Rola para a última mensagem
        }

        // Função para enviar mensagem ao backend
        async function sendMessage() {
            const message = userInput.value.trim();
            if (message === '') return;

            addMessage('user', message);
            userInput.value = ''; // Limpa o campo de entrada

            try {
                const response = await fetch(`${API_BASE_URL}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: 'fabio_user', message: message }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                addMessage('bot', data.response);
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                addMessage('bot', 'Sinto muito, meu amigo. Parece que minha mente está um pouco turva no momento. Por favor, tente novamente mais tarde.');
            }
        }

        // Função para reiniciar a conversa
        async function resetConversation() {
            try {
                const response = await fetch(`${API_BASE_URL}/reset`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: 'fabio_user' }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                // Limpa o chatbox e adiciona a mensagem de reset do bot
                chatBox.innerHTML = '';
                addMessage('bot', 'Olá! Eu sou Serenity AI, seu monge digital. Como posso ajudá-lo a encontrar a paz hoje?');
                addMessage('bot', data.message); // Mensagem de confirmação do reset
            } catch (error) {
                console.error('Erro ao reiniciar conversa:', error);
                addMessage('bot', 'Sinto muito, não consegui reiniciar a conversa. Por favor, tente novamente.');
            }
        }

        // Event Listeners
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { // Envia ao pressionar Enter, mas permite Shift+Enter para nova linha
                e.preventDefault(); // Previne a quebra de linha padrão do Enter
                sendMessage();
            }
        });
        resetButton.addEventListener('click', resetConversation);
    });
