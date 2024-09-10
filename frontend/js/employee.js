async function getEmployee() {
    const url = "http://localhost:5000/employee";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
  
        const employees = json.employee;
        const tableBody = document.getElementById("employeeTableBody");
  
        // Limpa o conteúdo anterior
        tableBody.innerHTML = "";
  
        // Adiciona os novos funcionários
        employees.forEach(employee => {
            const row = document.createElement("tr");
  
            const idCell = document.createElement("td");
            idCell.textContent = employee.id;
  
            const nameCell = document.createElement("td");
            nameCell.textContent = employee.name;
  
            const emailCell = document.createElement("td");
            emailCell.textContent = employee.email;
  
            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(emailCell);
  
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error.message);
    }
  }
  window.onload = getEmployee;
  getEmployee()