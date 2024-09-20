document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita o reload da página

    const username = document.getElementById("username").value;
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