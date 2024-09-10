
document.getElementById('cancelDelete').addEventListener('click', hidePopover);
document.getElementById('refreshBooks').addEventListener('click', clearAndReloadBooks);

function hidePopover() {
    const popover = document.getElementById('addBooks');
    if (popover) {
        popover.style.display = 'none';
    } else {
        console.error('Popover element not found');
    }
}

function clearAndReloadBooks() {
    const tableBody = document.getElementById("booksTableBody");
    tableBody.innerHTML = ""; // Apaga o conteúdo da tabela
    getBooks(); // Recarrega os dados
}


async function addBook() {
    const title = document.getElementById('title').value;
    const publicationYear = document.getElementById('publication_year').value;
    const authorId = document.getElementById('author_id').value;
    const genre = document.getElementById('genre').value;

    // Desabilita o botão para evitar múltiplos envios
    const saveButton = document.getElementById('save');
    saveButton.disabled = true;

    try {
        const response = await fetch('http://localhost:5000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                author_id: authorId,
                publication_year: publicationYear,
                genre: genre
            })
        });

        if (response.ok) {
            clearAndReloadBooks(); // Recarrega os livros após adicionar
            hidePopover(); // Fecha o popover
        } else {
            console.error('Erro ao adicionar livro.');
        }
    } catch (error) {
        console.error('Erro ao adicionar livro:', error);
    } finally {
        // Reabilita o botão e limpa o formulário
        saveButton.disabled = false;
        document.getElementById('title').value = '';
        document.getElementById('publication_year').value = '';
        document.getElementById('author_id').value = '';
        document.getElementById('genre').value = '';
    }
}

async function deleteBook() {
    // Desabilita o botão para evitar múltiplos envios
    const deleteButton = document.getElementById('delete');

    try {
        const response = await fetch('http://localhost:5000/members', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: book_id })
        });

        if (response.ok) {
            const res = await response.json();
            console.log(res);
            alert('Livro deletado com sucesso'); // Exibe uma mensagem de sucesso
            clearAndReloadMembers(); // Recarrega os membros após deletar
            hidePopover(); // Fecha o popover
            return true
        } else {
            console.error('Erro ao deletar livro.');
        }
    } catch (error) {
        console.error('Erro ao deletar livro:', error);
    } finally {
        // Reabilita o botão e limpa o formulário
        document.getElementById('book_id').value = '';
    }
    return false
}
async function getBooks() {
    const url = "http://localhost:5000/books";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
  
        const books = json.books;
        const tableBody = document.getElementById("booksTableBody");
  
        // Limpa o conteúdo anterior
        tableBody.innerHTML = "";
  
        // Adiciona os novos livros
        books.forEach(book => {
            const row = document.createElement("tr");
  
            const idCell = document.createElement("td");
            idCell.textContent = book.book_id;
  
            const titleCell = document.createElement("td");
            titleCell.textContent = book.title;
  
            const authorCell = document.createElement("td");
            authorCell.textContent = book.author_id;
  
            const yearCell = document.createElement("td");
            yearCell.textContent = book.publication_year;
  
            const genreCell = document.createElement("td");
            genreCell.textContent = book.genre;

            const actionCell = document.createElement("td");

             // Botão para deletar que abre o popover
             const deleteButton = document.createElement("button");
             deleteButton.setAttribute('popovertarget', 'deleteMembersPopover')
             deleteButton.textContent = "Deletar";
             deleteButton.addEventListener('click', () => {
                 openDeletePopover(member[0]); // Certifique-se que `member[0]` tem o ID
             });
 
            actionCell.appendChild(deleteButton);
            row.appendChild(idCell);
            row.appendChild(titleCell);
            row.appendChild(authorCell);
            row.appendChild(yearCell);
            row.appendChild(genreCell);
  
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error.message);
    }
  }

// Função para filtrar os membros com base no input de pesquisa
function filterMembers() {
    const searchInput = document.querySelector('#search input[name="q"]').value.toLowerCase();
    const membersTableBody = document.getElementById('booksTableBody');
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
    getBooks();

    // Adiciona o evento de busca na barra de pesquisa
    const searchInput = document.querySelector('#search input[name="q"]');
    searchInput.addEventListener('input', filterMembers);
};