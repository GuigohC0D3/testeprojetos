// document.getElementById('refreshMembers').addEventListener('click', clearAndReloadMembers);
// document.getElementById('refreshBooks').addEventListener('click', clearAndReloadBooks);
// document.getElementById('refreshEmployees').addEventListener('click', clearAndReloadEmployees);

// function clearAndReloadMembers() {
//     const tableBody = document.getElementById("membersTableBody");
//     tableBody.innerHTML = ""; // Apaga o conteúdo da tabela
//     getMembers(); // Recarrega os dados
// }

// function clearAndReloadBooks() {
//     const tableBody = document.getElementById("booksTableBody");
//     tableBody.innerHTML = ""; // Apaga o conteúdo da tabela
//     getBooks(); // Recarrega os dados
// }

// function clearAndReloadEmployees() {
//     const tableBody = document.getElementById("employeesTableBody");
//     tableBody.innerHTML = ""; // Apaga o conteúdo da tabela
//     getEmployees(); // Recarrega os dados
// }

// async function getData() {
//     const url = "http://localhost:5000/users";
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`Response status: ${response.status}`);
//       }
//       const json = await response.json();

//       var userList = document.getElementsByClassName("userList")
      
//       for (let index = 0; index < Object(json).users.length; index++) {
//         const element = Object(json).users[index];

//         const newDiv = document.createElement("li");

//         // and give it some content
//         const newContent = document.createTextNode(element.name);
      
//         // add the text node to the newly created div
//         newDiv.appendChild(newContent);
      
//         userList[0].appendChild(newDiv); 
//       }
      
      
//     } catch (error) {
//         console.error(error.message);
//     }
// }

// async function getBooks() {
//   const url = "http://localhost:5000/books";
//   try {
//       const response = await fetch(url);
//       if (!response.ok) {
//           throw new Error(`Response status: ${response.status}`);
//       }
//       const json = await response.json();

//       const books = json.books;
//       const tableBody = document.getElementById("booksTableBody");

//       // Limpa o conteúdo anterior
//       tableBody.innerHTML = "";

//       // Adiciona os novos livros
//       books.forEach(book => {
//           const row = document.createElement("tr");

//           const idCell = document.createElement("td");
//           idCell.textContent = book.book_id;

//           const titleCell = document.createElement("td");
//           titleCell.textContent = book.title;

//           const authorCell = document.createElement("td");
//           authorCell.textContent = book.author_id;

//           const yearCell = document.createElement("td");
//           yearCell.textContent = book.publication_year;

//           const genreCell = document.createElement("td");
//           genreCell.textContent = book.genre;

//           row.appendChild(idCell);
//           row.appendChild(titleCell);
//           row.appendChild(authorCell);
//           row.appendChild(yearCell);
//           row.appendChild(genreCell);

//           tableBody.appendChild(row);
//       });
//   } catch (error) {
//       console.error(error.message);
//   }
// }

// async function getEmployee() {
//   const url = "http://localhost:5000/employees";
//   try {
//       const response = await fetch(url);
//       if (!response.ok) {
//           throw new Error(`Response status: ${response.status}`);
//       }
//       const json = await response.json();

//       const employees = json.employees;
//       const tableBody = document.getElementById("employeesTableBody");

//       // Limpa o conteúdo anterior
//       tableBody.innerHTML = "";

//       // Adiciona os novos funcionários
//       employees.forEach(employee => {
//           const row = document.createElement("tr");

//           const idCell = document.createElement("td");
//           idCell.textContent = employee.id;

//           const nameCell = document.createElement("td");
//           nameCell.textContent = employee.name;

//           const emailCell = document.createElement("td");
//           emailCell.textContent = employee.email;

//           row.appendChild(idCell);
//           row.appendChild(nameCell);
//           row.appendChild(emailCell);

//           tableBody.appendChild(row);
//       });
//   } catch (error) {
//       console.error(error.message);
//   }
// }



// getMembers()
// getBooks()
// getEmployee()
  
