let titleInput = document.getElementById('title');
let descInput = document.getElementById('desc');
let locInput = document.getElementById('demo');
let famInput = document.getElementById('families');

//gets the value of the bird family from the dropdown
famInput.addEventListener("change", function(){
  localStorage.setItem("value", this.value);
});

//read the file input from the html file
const input = document.querySelector('input[type = "file"]');
const reader = new FileReader();

let todoId = document.getElementById('todo-id');
let titleEditInput = document.getElementById('title-edit');
let descEditInput = document.getElementById('desc-edit');
let locEditInput = document.getElementById('loc-edit');
let famEditInput = document.getElementById('families-edit')
let todos = document.getElementById('todos');
let data = [];
let selectedTodo = {};
const api = 'http://127.0.0.1:8000';

//get the image input when 'add image' button is clicked
input.addEventListener('change', e => {
  const imageFile = e.target.files[0];
  let x = reader.readAsDataURL(imageFile);
  
});

//reader.addEventListener('load', () => {
  //localStorage.setItem('image-'+index);
//});



function tryAdd() {
  let msg = document.getElementById('msg');
  msg.innerHTML = '';
}



document.getElementById('form-add').addEventListener('submit', (e) => {
  e.preventDefault();
  let obj = localStorage.getItem("value");

  if (!titleInput.value) {
    document.getElementById('msg').innerHTML = 'Todo cannot be blank';

  } 
else {
    addTodo(titleInput.value, descInput.value, locInput.value, obj);

    // close modal
    let add = document.getElementById('add');
    add.setAttribute('data-bs-dismiss', 'modal');
    add.click();
    (() => {
      add.setAttribute('data-bs-dismiss', '');
    })();
  }
});

let addTodo = (title, description, location, family) => {
  //load and add the image
console.log(localStorage)
  const images = Array.from(input.files);
  images.forEach((image, index) =>{
    i = index.toString()
  reader.addEventListener('load', () => {
    localStorage.setItem('image'+i, reader.result);
  });
  reader.readAsDataURL(image);
  console.log(localStorage);}); 

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 201) {
      const newTodo = JSON.parse(xhr.responseText);
      data.push(newTodo);
      refreshTodos();
    }
  };
  xhr.open('POST', `${api}/todos`, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title, description, location, family}));
};


let refreshTodos = () => {
  todos.innerHTML = '';
  data
    .sort((a, b) => b.id - a.id)
    .map((c) => {
      return (todos.innerHTML += `
        <div id="todo-${c.id}">
          <span class="fw-bold fs-4">${c.title}</span>
          <pre class="text-secondary ps-3">${c.description}</pre>
           
          <img id = "output" class = "center">
          <pre class="text-secondary ps-3">${c.location}</pre> 
          <span class="options">
            <i onClick="tryEditTodo(${c.id})" data-bs-toggle="modal" data-bs-target="#modal-edit" class="fas fa-edit"></i>
            <i onClick="deleteTodo(${c.id})" class="fas fa-trash-alt"></i>

          </span>

        </div>
    `);
    });

  resetForm();
};


let tryEditTodo = (id) => {
  const todo = data.find((c) => c.id === id);
  selectedTodo = todo;
  todoId.innerText = todo.id;
  titleEditInput.value = todo.title;
  descEditInput.value = todo.description;
  locEditInput.value = todo.location;
  famEditInput.value = todo.family;

  document.getElementById('msg').innerHTML = '';
};
document.getElementById('form-edit').addEventListener('submit', (e) => {
  e.preventDefault();

  if (!titleEditInput.value) {
    msg.innerHTML = 'Todo cannot be blank';
  } else {
    editTodo(titleEditInput.value, descEditInput.value, locEditInput.value, famEditInput.value);

    // close modal
    let edit = document.getElementById('edit');
    edit.setAttribute('data-bs-dismiss', 'modal');
    edit.click();
    (() => {
      edit.setAttribute('data-bs-dismiss', '');
    })();
  }
});


let editTodo = (title, description, location, family) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {

      selectedTodo.title = title;
      selectedTodo.description = description;
      selectedTodo.location = location;
      selectedTodo.family = family;

      refreshTodos();
    }
  };
  xhr.open('PUT', `${api}/todos/${selectedTodo.id}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title, description, location, family }));
  refreshTodos();
};


let deleteTodo = (id) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = data.filter((x) => x.id !== id);
      refreshTodos();
    }
  };
  xhr.open('DELETE', `${api}/todos/${id}`, true);
  xhr.send();
};

let resetForm = () => {
  titleInput.value = '';
  descInput.value = '';
  locInput.value = '';
  famInput.value = '';
  //reload the images when page is reset 
  const storedImages = document.querySelectorAll('#output');
  storedImages.forEach((img, index) =>{
    i = index.toString();
    img.src = localStorage.getItem('image'+i);
  });
};


let getTodos = () => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      data = JSON.parse(xhr.responseText) || [];
      refreshTodos();
    }
  };
  xhr.open('GET', `${api}/todos`, true);
  xhr.send();
};

(() => {
  getTodos();
})();



  //get user's location using the geolocation thing
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      locInput.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
//add the location to the location text box
  function showPosition(position) {
    locInput.value =
      "Latitude: " + position.coords.latitude +
    "   Longitude: " + position.coords.longitude;

  }

  var loadFile = function(event) {
    var image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
};

