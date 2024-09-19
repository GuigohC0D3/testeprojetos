document.addEventListener('DOMContentLoaded', () => {
    carregarHistorico();
});

async function carregarHistorico() {
    try {
        const response = await fetch('http://localhost:5000/historico');
        if (!response.ok) {
            throw new Error('Erro ao carregar o histórico');
        }
        const data = await response.json();
        
        console.log("Dados recebidos do backend:", data);
        renderizarHistorico(data);
        
    } catch (error) {
        console.error('Erro ao carregar o histórico:', error);
    }
}

function renderizarHistorico(historico) {
    const historicoContainer = document.getElementById('historico-container');
    historicoContainer.innerHTML = ''; // Limpa o conteúdo anterior

    if (historico.length === 0) {
        historicoContainer.innerHTML = '<p>Não há histórico disponível.</p>';
        return;
    }

    historico.forEach(item => {
        const message = `${item.member} alugou "${item.title}" no dia ${item.rental_date} e ${
            item.return_date ? 'entregou em ' + item.return_date : 'ainda não foi entregue'
        }.`;

        const messageElement = document.createElement('p');
        messageElement.textContent = message;

        historicoContainer.appendChild(messageElement);
    });
}


        // Chama a função ao carregar a página
        window.onload = carregarHistorico;