// Função assíncrona para gerenciar o login
async function handleLogin(event) {
    event.preventDefault();  // Evita o comportamento padrão do formulário

    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    const response = await fetch('http://127.0.0.1:5000/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const result = await response.json();
        alert(result.error);
        return;  // Para evitar erro de JSON se a resposta não for ok
    }

    const result = await response.json();
    alert(result.message);
    window.location.href = 'home.html';  // Redireciona para a página home após login
}

// Adiciona o evento de submit ao formulário
document.querySelector('form').addEventListener('submit', handleLogin);
