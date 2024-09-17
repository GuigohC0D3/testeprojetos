document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Evita o envio tradicional do formulário

            // Pega os valores dos inputs
            const name = document.getElementById('name').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const phonenumber = document.getElementById('phonenumber').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const declaration = document.getElementById('declaration').checked; // Verifica se o checkbox foi marcado

            // Validação simples no frontend
            if (!name || !username || !email || !phonenumber || !password || !confirmPassword) {
                document.getElementById('errorMessage').textContent = 'Por favor, preencha todos os campos.';
                return;
            }

            // Verificação das senhas
            if (password !== confirmPassword) {
                document.getElementById('errorMessage').textContent = 'As senhas não coincidem.';
                return;
            }

            if (!declaration) {
                document.getElementById('errorMessage').textContent = 'Você precisa aceitar a declaração para se registrar.';
                return;
            }

            // Limpa a mensagem de erro
            document.getElementById('errorMessage').textContent = '';

            try {
                // Envia os dados para o backend
                const response = await fetch('http://localhost:5000/members', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, username, email, password, phonenumber })
                });

                if (response.ok) {
                    alert('Membro registrado com sucesso!');
                    document.getElementById('registerForm').reset(); // Limpa o formulário após o sucesso
                } else {
                    const errorText = await response.text();
                    document.getElementById('errorMessage').textContent = `Erro ao registrar membro: ${errorText}`;
                }
            } catch (error) {
                console.error('Erro ao registrar membro:', error);
                document.getElementById('errorMessage').textContent = 'Erro ao registrar membro. Tente novamente mais tarde.';
            }
        });
    } else {
        console.error('O formulário de registro não foi encontrado.');
    }
});
