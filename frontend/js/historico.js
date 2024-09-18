document.getElementById('refreshHistorico').addEventListener('click', loadHistorico);

        async function loadHistorico() {
            const url = 'http://localhost:5000/historico';
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar histórico. Status: ${response.status}`);
                }
                const json = await response.json();
                const historico = json.historico;

                const tableBody = document.getElementById('historicoTableBody');
                tableBody.innerHTML = '';

                historico.forEach(item => {
                    const row = document.createElement('tr');

                    Object.keys(item).forEach(key => {
                        const cell = document.createElement('td');
                        cell.textContent = item[key];
                        row.appendChild(cell);
                    });

                    tableBody.appendChild(row);
                });
            } catch (error) {
                console.error('Erro ao carregar histórico:', error);
            }
        }

        window.onload = function () {
            loadHistorico();
        }