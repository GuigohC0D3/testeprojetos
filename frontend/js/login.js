document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Evita o envio tradicional do formulário

            // Pega os valores dos inputs
            const usernameOrEmail = document.getElementById('email_or_username').value;
            const password = document.getElementById('password').value;

            // Validação simples no frontend
            if (!usernameOrEmail || !password) {
                document.getElementById('errorMessage').textContent = 'Por favor, preencha todos os campos.';
                return;
            }

            // Limpa a mensagem de erro
            document.getElementById('errorMessage').textContent = '';

            try {
                // Envia os dados para o backend
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({emai: email, username: username, password: password })
                });

                if (response.ok) {
                    // Redireciona o usuário para a página inicial após o login bem-sucedido
                    window.location.href = '/home';
                } else {
                    const errorText = await response.text();
                    document.getElementById('errorMessage').textContent = `Erro ao realizar login: ${errorText}`;
                }
            } catch (error) {
                console.error('Erro ao realizar login:', error);
                document.getElementById('errorMessage').textContent = 'Erro ao realizar login. Tente novamente mais tarde.';
            }
        });
    } else {
        console.error('O formulário de login não foi encontrado.');
    }
});
