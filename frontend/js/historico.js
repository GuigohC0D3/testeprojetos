document.addEventListener('DOMContentLoaded', () => {
    loadHistorico();
});

function loadHistorico() {
    fetch('http://localhost:5000/books')
        .then(response => response.json())
        .then(data => {
            if (data.historico) {
                const historicoDiv = document.getElementById('historico');
                historicoDiv.innerHTML = ''; // Limpa o conteúdo anterior

                data.historico.forEach(item => {
                    const rentalDate = new Date(item.rental_date);
                    const returnDate = item.return_date ? new Date(item.return_date) : null;
                    const today = new Date();

                    let statusMessage = `O membro ${item.member_id} alugou "${item.title}" no dia ${rentalDate.toLocaleDateString()} e entregou ${returnDate ? returnDate.toLocaleDateString() : 'não devolvido'}.`;

                    if (returnDate === null || returnDate > today) {
                        statusMessage += ' Caso não entregue no dia, será cobrada uma multa.';
                    }

                    const p = document.createElement('p');
                    p.textContent = statusMessage;
                    historicoDiv.appendChild(p);
                });
            } else {
                throw new Error('Erro ao buscar histórico.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar histórico:', error);
        });
}
