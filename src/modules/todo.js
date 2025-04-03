import {selectedProjectID} from "./project"
import {serialization, deSerialization, setLocalStorage, getLocalStorage, overlay} from "./helper"
import {todoCardClass} from '../index';

let overlayDiv = document.querySelector(".overlay")

const todoCreateModal = document.querySelector(".createTodoModal");
const todoCreateForm = document.querySelector("#createTodoForm");

const todoEditModal = document.querySelector(".editTodoModal");
const todoEditForm = document.querySelector("#editTodoForm");

const todoDeleteModal = document.querySelector(".deleteTodoModal");
const todoDeleteForm = document.querySelector("#deleteTodoForm");


let projectMap = null;
let todoList = null;

function loadTodos(newTodoID=false){

    projectMap = deSerialization(getLocalStorage(selectedProjectID))
    sortTodos()


    todoList = projectMap.get("todos");

    let todoIDs = Array.from(todoList.keys()); 


    const todoListDiv = document.querySelector(".todoList");
    
    // check for expanded.
    let exandedDivs = []
    const childs = document.querySelectorAll(".ToDo")
    childs.forEach(child => {
        if(child.classList.contains("expanded")){
            exandedDivs.push(child.id)
        }
    })


    while (todoListDiv.children.length > 1) {
        todoListDiv.lastElementChild.remove();
    }

    // MIGHT BE MIXING IDS EVERYTIME IT REFRESHES. Like todo 3 becomes todo 1;

    todoIDs.forEach(todoID => {

        const todoDiv = document.querySelector(".ToDo").cloneNode(true)
        todoDiv.classList.add(todoID)

        todoDiv.id = todoID
        // expand if it was expanded before refreshing
        if(exandedDivs.includes(todoID)){
            todoDiv.classList.add("expanded")
            const dropIcon = todoDiv.querySelector(".dropIcon")
            dropIcon.classList.add("rotated")
        }

        const todoObject = todoList.get(todoID)

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
    

    if(newTodoID){
        const newTodoDiv = document.getElementById(newTodoID)
        newTodoDiv.classList.add("expanded")

        const dropIcon = newTodoDiv.querySelector(".dropIcon")
        dropIcon.classList.add("rotated")

        newTodoDiv.scrollIntoView({ behavior: 'smooth' , block: 'end'})
    }
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

    // sort the todo maps to preserve the insertion order.
    const sortedTop = new Map([...top.entries()].sort((a, b) =>{
        return parseInt(a[0].split('_')[1]) - parseInt(b[0].split('_')[1])
    }))

    const sortedNormal = new Map([...normal.entries()].sort((a, b) =>{
        return parseInt(a[0].split('_')[1]) - parseInt(b[0].split('_')[1])
    }))

    const sortedLow = new Map([...low.entries()].sort((a, b) =>{
        return parseInt(a[0].split('_')[1]) - parseInt(b[0].split('_')[1])
    }))

    todoList.clear()

    sortedTop.forEach((value, key) => {
        if(value.progress){
            progress.set(key, value)
        }
        else{
            todoList.set(key, value)
        }
    })
    sortedNormal.forEach((value, key) => {
        if(value.progress){
            progress.set(key, value)
        }
        else{
            todoList.set(key, value)
        }
    })
    sortedLow.forEach((value, key) => {
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
    
    // Gets the IDs of currently existing todos
    const keys = Array.from(TodoListMap.keys());

    // extracts the highest serial number from current todos
    function extractLargestNum(keys){

        let highest = 0;

        // if there's no todo, retuns 0 as highest
        if(!keys){
            return highest;
        }
        else{
            keys.forEach(key => {
                const current = parseInt(key.split('_')[1]);
                highest = current > highest ? current : highest;
            })
            return highest;
        }

    }
    const largestNum = extractLargestNum(keys)

    // creates an unique id besed on previous ID
    const createTodoID = `Todo_${largestNum + 1}`

    const todoObject = {
        title : todoTitle,
        desc : todoDesc,
        priority : todoPriority,
        progress : false
    }

    TodoListMap.set(createTodoID, todoObject)

    setLocalStorage(selectedProjectID, serialization(projectMap))

    loadTodos(createTodoID)
    todoCreateModal.close();
    overlayDiv.style.display = "none"
    todoCreateForm.reset();
}


function editTodo(){


    let titleInput = todoEditForm.querySelector("#editTodoTitle")
    let DescInput = todoEditForm.querySelector("#editTodoDesc")
    let priorityInput = todoEditForm.querySelector("#editTodoPriority")

    titleInput.value = todoList.get(todoCardClass).title;
    DescInput.value = todoList.get(todoCardClass).desc;
    priorityInput.value = todoList.get(todoCardClass).priority;



    todoEditModal.show()
    overlayDiv.style.display = "inline"

    todoEditForm.removeEventListener("submit", editTodoSubmission);
    todoEditForm.addEventListener("submit", editTodoSubmission)


    todoEditModal.querySelector(".cancelBtn").addEventListener("click", () => {
        todoEditModal.close();
        todoEditForm.reset()
        overlayDiv.style.display = "none"
        todoEditForm.removeEventListener("submit", editTodoSubmission);
    })
}

function editTodoSubmission(e){
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
    overlayDiv.style.display = "none"
    todoEditForm.reset();
}






function deleteTodo(){

    // load todo title
    let titleInput = todoDeleteForm.querySelector("#deleteTodoTitle")
    titleInput.textContent = todoList.get(todoCardClass).title;


    todoDeleteModal.show()
    overlayDiv.style.display = "inline"

    todoDeleteForm.removeEventListener("submit", deleteTodoSubmission)
    todoDeleteForm.addEventListener("submit", deleteTodoSubmission)

    todoDeleteModal.querySelector(".cancelBtn").addEventListener("click", () => {
        todoDeleteModal.close();
        todoDeleteForm.reset()
        overlayDiv.style.display = "none"
        todoDeleteForm.removeEventListener("submit", deleteTodoSubmission)
    })
}

function deleteTodoSubmission(e){
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


