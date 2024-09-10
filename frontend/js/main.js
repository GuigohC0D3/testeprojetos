async function getData() {
    const url = "http://localhost:5000/users";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();

      var userList = document.getElementsByClassName("userList")
      
      for (let index = 0; index < Object(json).users.length; index++) {
        const element = Object(json).users[index];

        const newDiv = document.createElement("li");

        // and give it some content
        const newContent = document.createTextNode(element.name);
      
        // add the text node to the newly created div
        newDiv.appendChild(newContent);
      
        userList[0].appendChild(newDiv); 
      }
      
      
    } catch (error) {
        console.error(error.message);
    }
}

async function getMembers() {
    const url = "http://localhost:5000/members";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json)
      var userList = document.getElementsByClassName("get_members")
      
      for (let index = 0; index < Object(json).date.length; index++) {
        const element = Object(json).date[index];

        const newDiv = document.createElement("li");

        // and give it some content
        const newContent = document.createTextNode(element.name);
      
        // add the text node to the newly created div
        newDiv.appendChild(newContent);
      
        userList[0].appendChild(newDiv); 
      }
      
      
    } catch (error) {
        console.error(error.message);
    }
}

getMembers()