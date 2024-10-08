document.getElementById('refreshMembers').addEventListener('click', clearAndReloadMembers);
document.getElementById('cancelDelete').addEventListener('click', hidePopover);


// Função para apagar conteudo da tabela e regarregar a página
function clearAndReloadMembers() {
    const tableBody = document.getElementById("membersTableBody");
    tableBody.innerHTML = ""; // Apaga o conteúdo da tabela
    getMembers(); // Recarrega os dados
}


// Função para abrir o modal e preencher os campos com os dados do membro
function openEditModal(memberId, currentName, currentEmail, currentUsername, currentPassword, currentPhoneNumber) {
    const editMemberId = document.getElementById('editMemberId');
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editUsername = document.getElementById('editUsername');
    const editPassword = document.getElementById('editPassword');
    const editPhonenumber = document.getElementById('editPhonenumber');

    // Verifica se todos os elementos foram encontrados
    if (editMemberId && editName && editEmail && editUsername && editPassword && editPhonenumber) {
        editMemberId.value = memberId;
        editName.value = currentName;
        editEmail.value = currentEmail;
        editUsername.value = currentUsername;
        editPassword.value = currentPassword;
        editPhonenumber.value = currentPhoneNumber;
        document.getElementById('editMemberModal').style.display = 'block';
    } else {
        console.error("Um ou mais elementos do modal de edição não foram encontrados no DOM.");
    }
}


function openDeletePopover(id) {
    const popoverDelete = document.getElementById('deleteMembersPopover')
    const popoverDeleteBtn = document.getElementById('popoverDeleteBtn')
    const popoverDeleteMsg = document.getElementById('popoverDeleteMsg')
    popoverDeleteMsg.innerHTML = 'Deseja deletar o membro com id: ' + id + "?"

    popoverDeleteBtn.addEventListener('click', () => {
        deleteMember(id);
        popoverDelete.style.display = 'none'
    });
}

// Função para fechar o modal
function closeEditModal() {
    document.getElementById('editMemberModal').style.display = 'none';
    document.getElementById('deleteMembersPopover').style.display = 'none';
    document.getElementById('addMembers').style.display = 'none';
}

// Função para salvar as atualizações
async function saveUpdatedMember() {
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const member_id = document.getElementById('editMemberId').value;
    const username = document.getElementById('editUsername').value;
    const password = document.getElementById('editPassword').value;
    const phonenumber = document.getElementById('editPhonenumber').value;

    try {
        const response = await fetch(`http://localhost:5000/members`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: member_id, name: name, email: email, username: username, password: password, phonenumber: phonenumber })
        });

        if (response.ok) {
            clearAndReloadMembers(); // Recarrega a lista de membros
            closeEditModal(); // Fecha o modal após salvar
        } else {
            const errorText = await response.text();
            console.error('Erro ao atualizar membro:', errorText);
        }
    } catch (error) {
        console.error('Erro ao atualizar membro:', error);
    }
}

// Função para fechar popover
function hidePopover() {
    const popover = document.getElementById('addMembers');
    if (popover) {
        popover.style.display = 'none';
    } else {
        console.error('Popover element not found');
    }
}

// Função para deletar membros
async function deleteMember(member_id) {
    // Desabilita o botão para evitar múltiplos envios
    const deleteButton = document.getElementById('delete');

    try {
        const response = await fetch('http://localhost:5000/members', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: member_id })
        });

        if (response.ok) {
            const res = await response.json();
            console.log(res);
            
            if (res.status === 200) {
                alert('Membro deletado com sucesso');  // Exibe uma mensagem de sucesso
                clearAndReloadMembers();  // Recarrega os membros após deletar
                hidePopover();  // Fecha o popover
            } else if (res.status === 404) {
                alert('Membro não encontrado');
            }
        } else {
            alert('Erro ao deletar membro');
            console.error('Erro ao deletar membro.');
        }
    } catch (error) {
        console.error('Erro ao deletar membro:', error);
    } finally {
        // Reabilita o botão e limpa o formulário
        document.getElementById('member_id').value = '';
    }
}


// Função para adicionar membros
async function addMember() {
    const name = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const phonenumber = document.getElementById('phonenumber').value;

    // Desabilita o botão para evitar múltiplos envios
    const saveButton = document.getElementById('save');
    saveButton.disabled = true;

    try {
        const response = await fetch('http://localhost:5000/members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, email: email, username: username, password: password, phonenumber: phonenumber })
        });

        if (response.ok) {
            clearAndReloadMembers(); // Recarrega os membros após adicionar
            hidePopover(); // Fecha o popover
        } else {
            console.error('Erro ao adicionar membro.');
        }
    } catch (error) {
        console.error('Erro ao adicionar membro:', error);
    } finally {
        // Reabilita o botão e limpa o formulário
        saveButton.disabled = false;
        document.getElementById('nome').value = '';
        document.getElementById('email').value = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('phonenumber').value = '';
    }
}

// Função atualizada de getMembers para adicionar botão de edição
async function getMembers() {
    const url = "http://localhost:5000/members";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        const members = json.data;
        const tableBody = document.getElementById("membersTableBody");

        // Limpa o conteúdo anterior
        tableBody.innerHTML = "";

        // Adiciona os novos membros
        members.forEach(member => {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = member[0];

            const nameCell = document.createElement("td");
            nameCell.textContent = member[1];

            const emailCell = document.createElement("td");
            emailCell.textContent = member[2];

            const usernameCell = document.createElement("td");
            usernameCell.textContent = member[3];

            const passwordCell = document.createElement("td");
            passwordCell.textContent = member[4];

            const phonenumberCell = document.createElement("td");
            phonenumberCell.textContent = member[5]

            const actionCell = document.createElement("td");
            
            // Botão para editar
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.addEventListener('click', () => {
                openEditModal(member[0], member[1], member[2], member[3], member[4], member[5]);
            });

            // Botão para deletar que abre o popover
            const deleteButton = document.createElement("button");
            deleteButton.setAttribute('popovertarget', 'deleteMembersPopover')
            deleteButton.textContent = "Deletar";
            deleteButton.addEventListener('click', () => {
                openDeletePopover(member[0]); // Certifique-se que `member[0]` tem o ID
            });
            
            actionCell.appendChild(deleteButton);
            actionCell.appendChild(editButton);
            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(usernameCell);
            row.appendChild(passwordCell);
            row.appendChild(phonenumberCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error.message);
    }
}

// Função para filtrar os membros com base no input de pesquisa
function filterMembers() {
    const searchInput = document.querySelector('#search input[name="q"]').value.toLowerCase();
    const membersTableBody = document.getElementById('membersTableBody');
    const rows = membersTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName('td')[1]; // Segunda coluna (Nome)
        const emailCell = rows[i].getElementsByTagName('td')[2]; // Terceira coluna (Email)
        const name = nameCell.textContent.toLowerCase();
        const email = emailCell.textContent.toLowerCase();

        // Verifica se o nome ou email contém o termo de busca
        if (name.includes(searchInput) || email.includes(searchInput)) {
            rows[i].style.display = ''; // Mostra a linha
        } else {
            rows[i].style.display = 'none'; // Esconde a linha
        }
    }
}
// Carregar os membros ao carregar a página
window.onload = function () {
    getMembers();

    // Adiciona o evento de busca na barra de pesquisa
    const searchInput = document.querySelector('#search input[name="q"]');
    searchInput.addEventListener('input', filterMembers);
};
