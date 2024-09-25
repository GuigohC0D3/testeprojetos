 document.addEventListener("DOMContentLoaded", async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/members', {
                method: 'GET',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                const userInfo = await response.json();

                // Atualiza a navbar com o nome e foto de perfil do usuário
                document.getElementById('login-register').style.display = 'none'; // Esconde o botão de login/register
                document.getElementById('user-profile').style.display = 'block'; // Mostra o perfil do usuário
                document.getElementById('username-display').textContent = userInfo.username;
                document.getElementById('profile-pic').src = userInfo.profile_pic;
            } else {
                console.log("Usuário não logado");
            }
        } catch (error) {
            console.error("Erro ao obter informações do usuário:", error);
        }
    });
