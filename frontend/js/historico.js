async function loadHistorico() {
    try {
        const response = await fetch('http://localhost:5000/alugueis');

        if (!response.ok) {
            throw new Error(`Erro ao buscar histórico. Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.historico) {
            const historicoDiv = document.getElementById('historico');
            historicoDiv.innerHTML = ''; // Limpa o conteúdo anterior

            data.historico.forEach(item => {
                const rentalDate = new Date(item.rental_date);
                const returnDate = item.return_date ? new Date(item.return_date) : null;
                const today = new Date();

                let statusMessage = `O membro ${item.member_id} alugou "${item.title}" no dia ${rentalDate.toLocaleDateString()} e entregar ${returnDate ? returnDate.toLocaleDateString() : 'não devolvido'}.`;

                if (!returnDate || returnDate > today) {
                    statusMessage += ' Caso não entregue no dia, será cobrada uma multa.';
                }

                const p = document.createElement('p');
                p.textContent = statusMessage;
                historicoDiv.appendChild(p);
            });
        } else {
            throw new Error('Erro ao buscar histórico: dados não encontrados.');
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}
