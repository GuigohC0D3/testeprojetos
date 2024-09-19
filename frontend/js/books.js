document.getElementById('refreshBooks').addEventListener('click', clearAndReloadBooks);
document.getElementById('cancelDelete').addEventListener('click', hidePopover);
document.getElementById('rentBookButton').addEventListener('click', showRentPopover)
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

// Função para abrir o popover de aluguel de livro
function showRentPopover() {
    const rentPopover = document.getElementById('rentBookPopover');
    rentPopover.style.display = 'block';
}

// Função para fechar o popover de aluguel de livro
function hideRentPopover() {
    const rentPopover = document.getElementById('rentBookPopover');
    rentPopover.style.display = 'none';
}

// Adiciona evento ao botão "Alugar Livro" para mostrar o popover
document.getElementById('rentBookButton').addEventListener('click', showRentPopover);



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


async function confirmRentBook() {
    const memberId = document.getElementById('rentMemberId').value;
    const bookId = document.getElementById('rentBookId').value;
    const rentalDate = document.getElementById('rentalDate').value;
    const returnDate = document.getElementById('returnDate').value || null;  // Retorna null se o campo estiver vazio

    if (!memberId || !bookId || !rentalDate) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/alugueis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                member_id: memberId,
                book_id: bookId,
                rental_date: rentalDate,
                return_date: returnDate
            })
        });

        const res = await response.json();

        if (response.ok) {
            alert(res.data || "Livro alugado com sucesso!");

            // Atualizar a célula de disponibilidade para "Alugado" apenas para o livro alugado
            const rows = document.querySelectorAll("#booksTableBody tr");
            rows.forEach(row => {
                const idCell = row.querySelector("td:first-child").textContent;
                if (idCell == bookId) {
                    const availabilityCell = row.querySelector("td:last-child");
                    availabilityCell.textContent = "Alugado";  // Atualiza o status para "Alugado"
                }
            });

            hideRentPopover();  // Esconde o popover após o sucesso
        } else {
            alert(res.data || "Erro ao alugar o livro.");
        }
    } catch (error) {
        console.error('Erro ao alugar o livro:', error);
        alert("Erro de conexão ou erro inesperado.");
    }
}

// Função para atualizar a disponibilidade com base no rentalId e a returnDate
function updateBookAvailability(rentalId, bookId, returnDate) {
    const rows = document.querySelectorAll("#booksTableBody tr");
    rows.forEach(row => {
        const idCell = row.querySelector("td:first-child").textContent;

        if (idCell == bookId) {
            const availabilityCell = row.querySelector("td:last-child");

            if (returnDate === null || returnDate === "") {
                console.log(`Livro com ID ${bookId} encontrado. Atualizando status para 'Alugado'.`);
                availabilityCell.textContent = "Alugado";  // Sem data de devolução, o livro está alugado
            } else {
                console.log(`Livro com ID ${bookId} encontrado. Atualizando status para 'Disponível'.`);
                availabilityCell.textContent = "Disponível";  // Com data de devolução, o livro está disponível
            }
        }
    });
}

// Função para verificar e atualizar a disponibilidade do livro automaticamente
async function checkBookAvailability(bookId) {
    try {
        const response = await fetch(`http://localhost:5000/check_availability/${bookId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const res = await response.json();

        if (response.ok) {
            const availability = res.availability;

            // Atualiza o status na tabela do frontend
            const rows = document.querySelectorAll("#booksTableBody tr");
            rows.forEach(row => {
                const idCell = row.querySelector("td:first-child").textContent;
                if (idCell == bookId) {
                    const availabilityCell = row.querySelector("td:last-child");
                    availabilityCell.textContent = availability;
                }
            });
        } else {
            console.error(res.error || "Erro ao verificar disponibilidade.");
        }
    } catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
    }
}

// Chamada para verificar a disponibilidade de todos os livros ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const bookIds = Array.from(document.querySelectorAll("#booksTableBody tr td:first-child")).map(td => td.textContent);
    bookIds.forEach(bookId => checkBookAvailability(bookId));  // Verifica todos os livros na tabela
});


// Função que aluga o livro e atualiza o status de disponibilidade
async function confirmRentBook() {
    const memberId = document.getElementById('rentMemberId').value;
    const bookId = document.getElementById('rentBookId').value;
    const rentalDate = document.getElementById('rentalDate').value;
    const returnDate = document.getElementById('returnDate').value || null;  // Retorna null se o campo estiver vazio

    if (!memberId || !bookId || !rentalDate) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/alugueis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                member_id: memberId,
                book_id: bookId,
                rental_date: rentalDate,
                return_date: returnDate
            })
        });

        const res = await response.json();

        if (response.ok) {
            alert(res.data || "Livro alugado com sucesso!");

            const rentalId = res.rental_id;
            const updatedAvailability = res.availability;

            // Atualizar o status de disponibilidade na tabela usando o rentalId e returnDate
            updateBookAvailability(rentalId, bookId, returnDate);

            hideRentPopover();  // Esconde o popover após o sucesso
        } else {
            alert(res.data || "Erro ao alugar o livro.");
        }
    } catch (error) {
        console.error('Erro ao alugar o livro:', error);
        alert("Erro de conexão ou erro inesperado.");
    }
}
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:5000/livros'); // Endpoint que retorna a lista de livros
        const books = await response.json();

        const tableBody = document.getElementById('booksTableBody');
        tableBody.innerHTML = ''; // Limpa a tabela antes de preencher

        books.data.forEach(book => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author_id}</td>
                <td>${book.publication_year}</td>
                <td>${book.genre}</td>
                <td>
                    <button onclick="rentBook(${book.id})">Alugar</button>
                    <button onclick="editBook(${book.id})">Editar</button>
                    <button onclick="deleteBook(${book.id})">Excluir</button>
                </td>
                <td>${book.availability}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        alert('Erro ao buscar livros.');
    }
}

// Chama fetchBooks ao carregar a página
window.onload = fetchBooks;


async function loadBooks() {
    try {
        const response = await fetch('http://localhost:5000/books', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        if (response.ok) {
            const books = data.books;  // Acessa a chave 'books'

            const tableBody = document.getElementById('booksTableBody');
            tableBody.innerHTML = ''; // Limpa a tabela antes de carregar os novos dados

            books.forEach(book => {
                const row = document.createElement('tr');

                const bookIdCell = document.createElement('td');
                bookIdCell.textContent = book.book_id;

                const titleCell = document.createElement('td');
                titleCell.textContent = book.title;

                const statusCell = document.createElement('td');
                statusCell.textContent = book.disponibilidade;

                row.appendChild(bookIdCell);
                row.appendChild(titleCell);
                row.appendChild(statusCell);

                tableBody.appendChild(row);
            });
        } else {
            console.error('Erro ao carregar os livros:', data);
        }
    } catch (error) {
        console.error('Erro ao carregar os livros:', error);
    }
}



// Chame esta função quando a página carregar
document.addEventListener('DOMContentLoaded', loadBooks);


async function returnBook(rentalId) {
    try {
        const response = await fetch(`http://localhost:5000/books`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const res = await response.json();
            alert(`Livro devolvido com sucesso! Multa: ${res.fine}`);
            getBooks(); // Recarregar os livros para atualizar a disponibilidade
        } else {
            console.error('Erro ao devolver o livro.');
        }
    } catch (error) {
        console.error('Erro ao devolver o livro:', error);
    }
}

// Função para adicionar livros (POST)
async function addBook() {
    const title = document.getElementById('title').value;
    const authorId = document.getElementById('author_id').value;
    const publicationYear = document.getElementById('publication_year').value;
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
        const books = json.books;  // Acessa a chave 'books' diretamente

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

            const availabilityCell = document.createElement("td");
            availabilityCell.textContent = book.disponibilidade;

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
            row.appendChild(availabilityCell);

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
