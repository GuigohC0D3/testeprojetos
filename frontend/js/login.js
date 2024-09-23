document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita o reload da página

    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Faz a requisição para o backend
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
        // Redireciona para a página inicial após login bem-sucedido
        window.location.href = "/home";
    } else {
        alert("Login falhou: " + result.message);
    }
});


window.onload = function() {
    fetch('/login')  // Rota para obter os dados do usuário logado
        .then(response => response.json())
        .then(data => {
            document.getElementById('userName').textContent = data.name;
            document.getElementById('userCPF').textContent = data.cpf;
            document.getElementById('userMobile').textContent = data.mobile;
        })
        .catch(error => console.error('Erro ao carregar dados do usuário:', error));
};

// Função para logout
document.getElementById('logoutButton').addEventListener('click', function() {
    window.location.href = '/logout';  // Redirecionar para logout
});