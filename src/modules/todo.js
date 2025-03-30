import {selectedProjectID} from "./project"
import {serialization, deSerialization, setLocalStorage, getLocalStorage, overlay} from "./helper"


const todoCreateModal = document.querySelector(".createTodoModal");
const todoCreateForm = document.querySelector("#createTodoForm");

const todoEditModal = document.querySelector(".editTodoModal");
const todoEditForm = document.querySelector("#editTodoForm");

const todoDeleteModal = document.querySelector(".deleteTodoModal");
const todoDeleteForm = document.querySelector("#deleteTodoForm");


let projectMap = null;
let todoList = null;

function loadTodos(){

    // sortTodos()

    projectMap = deSerialization(getLocalStorage(selectedProjectID))

    console.log(projectMap)

    // this list contains multiple todo objects
    todoList = projectMap.get("todos");
    console.log(todoList)

    let todoIDs = Array.from(todoList.keys()); 


    const todoListDiv = document.querySelector(".todoList");
    

    while (todoListDiv.children.length > 1) {
        todoListDiv.lastElementChild.remove();
    }

    todoIDs.forEach(todoID => {

        const todoDiv = document.querySelector(".ToDo").cloneNode(true)
        todoDiv.classList.add(todoID)

        const todoObject = todoList.get(todoID)
        console.log(todoObject)

        const todoTitle = todoObject.title
        const todoDesc = todoObject.desc
        const todoPriority = todoObject.priority
        const todoProgress = todoObject.progress


        todoDiv.querySelector(".todoTitle").textContent = todoTitle
        todoDiv.querySelector(".todoDesc").textContent = todoDesc
        todoDiv.querySelector("#todoCheck").checked = (todoProgress == "true");

        let borderColor = todoPriority == "top" ? "red" : (todoPriority == "low" ? "green" : "yellow");
        todoDiv.style.borderLeft = `3px solid ${borderColor}`

        todoDiv.removeAttribute("hidden");
        todoListDiv.appendChild(todoDiv)
    })
}


// function sortTodos(){
    
//     console.log("%cSupposed to sort todos", "color: orange");

//     projectMap = JSON.parse(localStorage.getItem(selectedProjectID));

//     // this list contains multiple todo objects
//     todoList = projectMap.todos;

//     console.clear();
//     console.log(todoList)

//     // initially sort based on priority
    


//     // the checked ones should go at the bottom of the list
//     // but also check for user sortings
// }



function createTodo(){
    todoCreateModal.show()
    overlay()

    todoCreateForm.removeEventListener("submit", createTodoSubmission)
    todoCreateForm.addEventListener("submit", createTodoSubmission)


    todoCreateForm.querySelector(".cancelBtn").addEventListener("click", () => {
        todoEditModal.close();
        todoCreateForm.reset()
        overlay()
        todoCreateForm.removeEventListener("submit", createTodoSubmission)
    })
}



function createTodoSubmission(e){
    e.preventDefault();

    const formData = new FormData(e.target);
    const formValues = new Map(formData.entries());


    const todoTitle = formValues.get("todoTitle");
    const todoDesc = formValues.get("todoDesc");
    const todoPriority = formValues.get("todoPriority");

    const TodoListMap = projectMap.get("todos")


    const createTodoID = `Todo_${TodoListMap.size + 1}`;
    console.log(`Todo ID  = ${createTodoID}`)
    console.log("might be a problem here with id number")

    const todoObject = {
        title : todoTitle,
        desc : todoDesc,
        priority : todoPriority,
        progress : false
    }

    TodoListMap.set(createTodoID, todoObject)

    setLocalStorage(selectedProjectID, serialization(projectMap))

    loadTodos()
    todoCreateModal.close();
    overlay()
    todoCreateForm.reset();
}


function editTodo(todoCardClass){


    let titleInput = todoEditForm.querySelector("#editTodoTitle")
    let DescInput = todoEditForm.querySelector("#editTodoDesc")
    let priorityInput = todoEditForm.querySelector("#editTodoPriority")

    titleInput.value = todoList.get(todoCardClass).title;
    DescInput.value = todoList.get(todoCardClass).desc;
    priorityInput.value = todoList.get(todoCardClass).priority;


    todoEditModal.show()
    overlay()

    todoEditForm.removeEventListener("submit", editTodoSubmission)
    todoEditForm.addEventListener("submit", (e) => editTodoSubmission(e, todoCardClass))


    todoEditModal.querySelector(".cancelBtn").addEventListener("click", () => {
        todoEditModal.close();
        todoEditForm.reset()
        overlay()
        todoEditForm.removeEventListener("submit", editTodoSubmission)
    })
}

function editTodoSubmission(e, todoCardClass){
    e.preventDefault();

    const formData = new FormData(e.target);
    const formValues = new Map(formData.entries());

    // get the edited info
    const editedTodoTitle = formValues.get("editTodoTitle");
    const editedTodoDesc = formValues.get("editTodoDesc");
    const editedTodoPriority = formValues.get("editTodoPriority");

    let selectedTodo = todoList.get(todoCardClass)

    // update details
    selectedTodo.title =  editedTodoTitle;
    selectedTodo.desc =  editedTodoDesc;
    selectedTodo.priority =  editedTodoPriority;

    // add updated todo object to local storage
    projectMap.set("todos", todoList)
    setLocalStorage(selectedProjectID, serialization(projectMap))

    loadTodos()

    todoEditModal.close();
    overlay()
    todoEditForm.reset();
}






function deleteTodo(todoCardClass){

    // load todo title
    let titleInput = todoDeleteForm.querySelector("#deleteTodoTitle")
    titleInput.textContent = todoList.get(todoCardClass).title;


    todoDeleteModal.show()
    overlay()

    todoDeleteForm.removeEventListener("submit", deleteTodoSubmission)
    todoDeleteForm.addEventListener("submit", (e) => deleteTodoSubmission(e, todoCardClass))

    todoDeleteModal.querySelector(".cancelBtn").addEventListener("click", () => {
        todoDeleteModal.close();
        todoDeleteForm.reset()
        overlay()
        todoDeleteForm.removeEventListener("submit", deleteTodoSubmission)
    })
}

function deleteTodoSubmission(e, todoCardClass){
    e.preventDefault();

    // remove from the object
    todoList.delete(todoCardClass)
    projectMap.set("todos". todoList);
    setLocalStorage(selectedProjectID, serialization(projectMap))


    // reload the todos
    loadTodos()

    todoDeleteModal.close();
    overlay()
    todoDeleteForm.reset();
}

export {createTodo, editTodo, deleteTodo, loadTodos}


