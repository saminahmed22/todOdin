import {selectedProjectID} from "./project"
import {serialization, deSerialization, setLocalStorage, getLocalStorage, overlay} from "./helper"

let overlayDiv = document.querySelector(".overlay")

const todoCreateModal = document.querySelector(".createTodoModal");
const todoCreateForm = document.querySelector("#createTodoForm");

const todoEditModal = document.querySelector(".editTodoModal");
const todoEditForm = document.querySelector("#editTodoForm");

const todoDeleteModal = document.querySelector(".deleteTodoModal");
const todoDeleteForm = document.querySelector("#deleteTodoForm");


let projectMap = null;
let todoList = null;

function loadTodos(){

    projectMap = deSerialization(getLocalStorage(selectedProjectID))
    sortTodos()

    console.log(projectMap)

    todoList = projectMap.get("todos");
    console.log(todoList)

    let todoIDs = Array.from(todoList.keys()); 


    const todoListDiv = document.querySelector(".todoList");
    
    // check for expanded.
    // let exandedDivs = []
    // const childs = document.querySelectorAll(".ToDo")
    // childs.forEach(child => {
    //     if(child.classList.contains("expanded")){
    //         exandedDivs.push(child.id)
    //     }
    // })

    // exandedDivs.forEach(div => {
    //     console.log(`Extended div id: ${div}`)
    // })


    while (todoListDiv.children.length > 1) {
        todoListDiv.lastElementChild.remove();
    }

    // MIGHT BE MIXING IDS EVERYTIME IT REFRESHES. Like todo 3 becomes todo 1;

    todoIDs.forEach(todoID => {

        const todoDiv = document.querySelector(".ToDo").cloneNode(true)
        todoDiv.classList.add(todoID)
        todoDiv.id = todoID
        // console.log(`TODO DIV ID ${todoDiv.id}`)

        // if(exandedDivs.includes(todoID)){
        //     todoDiv.classList.add("expanded")
        // }


        const todoObject = todoList.get(todoID)
        console.log(`TODO OBJECT: ${JSON.stringify(todoObject)}`)

        const todoTitle = todoObject.title
        const todoDesc = todoObject.desc
        const todoPriority = todoObject.priority
        const todoProgress = todoObject.progress


        todoDiv.querySelector(".todoTitle").textContent = todoTitle
        todoDiv.querySelector(".todoDesc").textContent = todoDesc

        todoDiv.querySelector("#todoCheck").checked = todoProgress;

        if(todoProgress){
            todoDiv.style.opacity = ".5";
            todoDiv.querySelector("h6").style.textDecoration = "line-through";

        }
        else{
            todoDiv.style.opacity = "1";
            todoDiv.querySelector("h6").style.textDecoration = "none";
        }

        let borderColor = todoPriority == "top" ? "red" : (todoPriority == "low" ? "green" : "yellow");
        todoDiv.style.borderLeft = `3px solid ${borderColor}`

        todoDiv.removeAttribute("hidden");
        todoListDiv.appendChild(todoDiv)
    })
}


function sortTodos(){
    todoList = projectMap.get("todos");

    let top = new Map()
    let normal = new Map()
    let low = new Map()
    let progress = new Map()

    todoList.forEach((value, key) => {
        if(value.priority == "top"){
            top.set(key, value)
        }
        else if(value.priority == "normal"){
            normal.set(key, value)
        }
        else if(value.priority == "low"){
            low.set(key, value)
        }
    })

    todoList.clear()

    top.forEach((value, key) => {
        if(value.progress){
            progress.set(key, value)
        }
        else{
            todoList.set(key, value)
        }
    })
    normal.forEach((value, key) => {
        if(value.progress){
            progress.set(key, value)
        }
        else{
            todoList.set(key, value)
        }
    })
    low.forEach((value, key) => {
        if(value.progress){
            progress.set(key, value)
        }
        else{
            todoList.set(key, value)
        }
    })
    progress.forEach((value, key) => {
        todoList.set(key, value)
    })

    setLocalStorage(selectedProjectID, serialization(projectMap))
}




function createTodo(){
    console.log("%cTodo Event Triggered", "color:orange")
    todoCreateModal.show()
    overlayDiv.style.display = "inline"

    todoCreateForm.removeEventListener("submit", createTodoSubmission)
    todoCreateForm.addEventListener("submit", createTodoSubmission)


    todoCreateForm.querySelector(".cancelBtn").addEventListener("click", () => {
        todoCreateModal.close();
        todoCreateForm.reset()
        overlayDiv.style.display = "none"
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
    console.log(`TodoListMap size ${TodoListMap.size}`)

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
    overlayDiv.style.display = "none"
    todoCreateForm.reset();
}


function editTodo(todoCardClass){

    console.log(`TODO CARD CLASS: ${todoCardClass}`)

    let titleInput = todoEditForm.querySelector("#editTodoTitle")
    let DescInput = todoEditForm.querySelector("#editTodoDesc")
    let priorityInput = todoEditForm.querySelector("#editTodoPriority")

    titleInput.value = todoList.get(todoCardClass).title;
    DescInput.value = todoList.get(todoCardClass).desc;
    priorityInput.value = todoList.get(todoCardClass).priority;

    console.log(`titleInput: ${todoList.get(todoCardClass).title}`)
    console.log(`DescInput: ${todoList.get(todoCardClass).desc}`)
    console.log(`priorityInput: ${todoList.get(todoCardClass).priority}`)


    todoEditModal.show()
    overlayDiv.style.display = "inline"

    todoEditForm.removeEventListener("submit", editTodoSubmission);
    todoEditForm.addEventListener("submit", function handler(e){
        editTodoSubmission(e, todoCardClass)
        todoEditForm.removeEventListener("submit", handler)
    })


    todoEditModal.querySelector(".cancelBtn").addEventListener("click", () => {
        todoEditModal.close();
        todoEditForm.reset()
        overlayDiv.style.display = "none"
        todoEditForm.removeEventListener("submit", editTodoSubmission);
    })
}

function editTodoSubmission(e, todoCardClass){
    e.preventDefault();

    const formData = new FormData(e.target);
    const formValues = new Map(formData.entries());

    console.log(`Form VAlues:`)
    console.log(formValues)

    // get the edited info
    const editedTodoTitle = formValues.get("editTodoTitle");
    const editedTodoDesc = formValues.get("editTodoDesc");
    const editedTodoPriority = formValues.get("editTodoPriority");


    console.log(`editedTodoTitle: ${editedTodoTitle}`)
    console.log(`editedTodoDesc: ${editedTodoDesc}`)
    console.log(`editedTodoPriority: ${editedTodoPriority}`)

    let selectedTodo = todoList.get(todoCardClass)
    console.log("%cselected todo", "color:orange")
    console.log(selectedTodo)

    // update details
    selectedTodo.title =  editedTodoTitle;
    selectedTodo.desc =  editedTodoDesc;
    selectedTodo.priority =  editedTodoPriority;

    // add updated todo object to local storage
    projectMap.set("todos", todoList)
    setLocalStorage(selectedProjectID, serialization(projectMap))

    loadTodos()

    todoEditModal.close();
    overlayDiv.style.display = "none"
    todoEditForm.reset();
}






function deleteTodo(todoCardClass){

    // load todo title
    let titleInput = todoDeleteForm.querySelector("#deleteTodoTitle")
    titleInput.textContent = todoList.get(todoCardClass).title;


    todoDeleteModal.show()
    overlayDiv.style.display = "inline"

    todoDeleteForm.removeEventListener("submit", deleteTodoSubmission)
    todoDeleteForm.addEventListener("submit", (e) => deleteTodoSubmission(e, todoCardClass))

    todoDeleteModal.querySelector(".cancelBtn").addEventListener("click", () => {
        todoDeleteModal.close();
        todoDeleteForm.reset()
        overlayDiv.style.display = "none"
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
    overlayDiv.style.display = "none"
    todoDeleteForm.reset();
}

export {createTodo, editTodo, deleteTodo, loadTodos}


