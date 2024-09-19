 // Função para carregar o histórico do backend
        async function carregarHistorico() {
            try {
                const response = await fetch('http://localhost:5000/alugueis');
                const data = await response.json();

                // Seleciona o container onde as mensagens serão exibidas
                const historicoContainer = document.getElementById('historico-container');

                // Limpa o container antes de inserir novas mensagens
                historicoContainer.innerHTML = '';

                // Percorre cada item do histórico e exibe a mensagem
                data.forEach(item => {
                    const message = `${item.member} alugou "${item.title}" no dia ${item.rental_date} e entregou ${item.return_date || 'ainda não foi entregue'}.`;
                    
                    // Cria um elemento div para cada mensagem
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message');
                    messageDiv.textContent = message;

                    // Adiciona a mensagem ao container
                    historicoContainer.appendChild(messageDiv);
                });
            } catch (error) {
                console.error('Erro ao carregar o histórico:', error);
            }
        }

        // Chama a função ao carregar a página
        window.onload = carregarHistorico;