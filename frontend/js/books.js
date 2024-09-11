document.getElementById('refreshBooks').addEventListener('click', clearAndReloadBooks);
document.getElementById('cancelDelete').addEventListener('click', hidePopover);

//Função para apagar conteúdo da tabela e recarregar a página
function clearAndReloadBooks() {
    const tableBody = document.getElementById("booksTableBody");
    tableBody.innerHTML = ""; // Apaga o conteúdo da tabela
    getBooks(); // Recarrega os dados
}

// Função para abrir o modal de edição e preencher os campos com os dados do livro
function openEditModal(bookId, title, authorId, publicationYear, genre) {
    document.getElementById('editBookId').value = bookId;
    document.getElementById('editTitle').value = title;
    document.getElementById('editAuthorId').value = authorId;
    document.getElementById('editPublicationYear').value = publicationYear;
    document.getElementById('editGenre').value = genre;
    document.getElementById('editBookModal').style.display = 'block';
}

function openDeletePopover(bookId) {
    const popoverDelete = document.getElementById('deleteBookPopover');
    const popoverDeleteBtn = document.getElementById('popoverDeleteBtn');
    const popoverDeleteMsg = document.getElementById('popoverDeleteMsg');
    
    popoverDeleteMsg.innerHTML = 'Deseja deletar o livro com ID: ' + bookId + "?";

    popoverDeleteBtn.addEventListener('click', () => {
        deleteBook(bookId); // Chama a função de deletar o livro
        popoverDelete.style.display = 'none'; // Esconde o popover após deletar
    });

    popoverDelete.style.display = 'block'; // Mostra o popover ao clicar em deletar
}

// Função para fechar o modal de edição
function closeBookModal() {
    document.getElementById('editBookModal').style.display = 'none';
    hidePopover();
}

// Função para fechar o popover de deletar livro
function hidePopover() {
    const popover = document.getElementById('deleteBookPopover');
    if (popover) {
        popover.style.display = 'none';  // Esconde o popover de exclusão
    } else {
        console.error('Popover element not found');
    }
}

// Função para salvar atualizações no livro (PUT)
async function saveUpdatedBook() {
    const bookId = document.getElementById('editBookId').value;
    const title = document.getElementById('editTitle').value;
    const authorId = document.getElementById('editAuthorId').value;
    const publicationYear = document.getElementById('editPublicationYear').value;
    const genre = document.getElementById('editGenre').value;

    try {
        const response = await fetch(`http://localhost:5000/books`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                book_id: bookId,
                title: title,
                author_id: authorId,
                publication_year: publicationYear,
                genre: genre
            })
        });

        // Verifique a resposta do backend
        const data = await response.json();
        console.log("Resposta do servidor após atualização:", data);

        if (response.ok) {
            console.log("Livro atualizado com sucesso, recarregando tabela...");
            clearAndReloadBooks(); // Recarrega a lista de livros após a edição
            closeBookModal(); // Fecha o modal de edição após salvar
        } else {
            console.error('Erro ao atualizar livro. Status:', response.status);
        }
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
    }
}


// Função para deletar livros (DELETE)
async function deleteBook(bookId) {
    try {
        const response = await fetch('http://localhost:5000/books', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ book_id: bookId })
        });

        if (response.ok) {
            alert('Livro deletado com sucesso');
            clearAndReloadBooks(); // Recarrega a lista de livros após deletar
        } else {
            console.error('Erro ao deletar livro.');
        }
    } catch (error) {
        console.error('Erro ao deletar livro:', error);
    }
}

// Função para adicionar livros (POST)
async function addBook() {
    const title = document.getElementById('title').value;
    const authorId = document.getElementById('author_id').value;
    const publicationYear = document.getElementById('publication_year').value;
    const genre = document.getElementById('genre').value;

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
            clearAndReloadBooks(); // Recarrega a lista de livros após adicionar
            hidePopover(); // Fecha o popover
        } else {
            console.error('Erro ao adicionar livro.');
        }
    } catch (error) {
        console.error('Erro ao adicionar livro:', error);
    }
}


// Função para buscar livros no banco de dados (GET)
async function getBooks() {
    const url = "http://localhost:5000/books";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar livros. Status: ${response.status}`);
        }
        const json = await response.json();
        const books = json.books;
        console.log("Livros recebidos:", books);  // Verifique os dados recebidos

        const tableBody = document.getElementById("booksTableBody");

        // Limpa o conteúdo anterior
        tableBody.innerHTML = "";

        // Adiciona os novos livros na tabela
        books.forEach(book => {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = book.book_id;

            const titleCell = document.createElement("td");
            titleCell.textContent = book.title;

            const authorIdCell = document.createElement("td");
            authorIdCell.textContent = book.author_id;

            const yearCell = document.createElement("td");
            yearCell.textContent = book.publication_year;

            const genreCell = document.createElement("td");
            genreCell.textContent = book.genre;

            const actionCell = document.createElement("td");
            
            // Botão para editar
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.addEventListener('click', () => {
                openEditModal(book.book_id, book.title, book.author_id, book.publication_year, book.genre);
            });

            // Botão para deletar
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Deletar";
            deleteButton.addEventListener('click', () => {
                openDeletePopover(book.book_id);
            });

            actionCell.appendChild(deleteButton);
            actionCell.appendChild(editButton);
            row.appendChild(idCell);
            row.appendChild(titleCell);
            row.appendChild(authorIdCell);
            row.appendChild(yearCell);
            row.appendChild(genreCell);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Erro ao buscar livros:', error);
    }
}

// Carregar os livros ao carregar a página
window.onload = function () {
    getBooks();

    // Adiciona o evento de busca na barra de pesquisa
    const searchInput = document.querySelector('#search input[name="q"]');
    searchInput.addEventListener('input', filterBooks);
};

// Função para filtrar livros com base no input de pesquisa
function filterBooks() {
    const searchInput = document.querySelector('#search input[name="q"]').value.toLowerCase();
    const booksTableBody = document.getElementById('booksTableBody');
    const rows = booksTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const titleCell = rows[i].getElementsByTagName('td')[1]; // Segunda coluna (Título)
        const genreCell = rows[i].getElementsByTagName('td')[4]; // Quinta coluna (Gênero)
        const title = titleCell.textContent.toLowerCase();
        const genre = genreCell.textContent.toLowerCase();

        // Verifica se o título ou o gênero contém o termo de busca
        if (title.includes(searchInput) || genre.includes(searchInput)) {
            rows[i].style.display = ''; // Mostra a linha
        } else {
            rows[i].style.display = 'none'; // Esconde a linha
        }
    }
}
