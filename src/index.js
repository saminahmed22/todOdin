import "./styles.css";
import {createProject, editProject, deleteProject, postpone, loadProjectList, selectedProjectID} from "./modules/project"
import {createTodo, editTodo, deleteTodo} from "./modules/todo"


// Drag Logic
const container = document.querySelector(".todoList")

document.addEventListener('mousedown', (event) => {
    const dragIcon = event.target.closest(".dragIcon");
    if (!dragIcon) return;
    
    const draggable = dragIcon.closest(".ToDo");
    if (draggable) {
        draggable.setAttribute("draggable", "true");
    }
});

document.addEventListener('mouseup', (event) => {
    const dragIcon = event.target.closest(".dragIcon");
    if (!dragIcon) return;

    const draggable = dragIcon.closest(".ToDo");
    if (draggable) {
        draggable.setAttribute("draggable", "false");
    }
});

document.addEventListener('dragstart', (event) => {
    const draggable = event.target.closest(".ToDo");
    if (draggable) {
        draggable.classList.add('dragging');
    }
});

document.addEventListener('dragend', (event) => {
    const draggable = event.target.closest(".ToDo");
    if (draggable) {
        draggable.classList.remove('dragging');
        draggable.setAttribute("draggable", "false");
    }
});

container.addEventListener('dragover', e =>{
    e.preventDefault()
    const afterelem = getDragAfterElement(e.clientY)
    const draggable = document.querySelector(".dragging")
    if (afterelem == null) {
        container.appendChild(draggable)
    }
    else{
        container.insertBefore(draggable, afterelem)
    }
})




function getDragAfterElement(y){
    const draggableElem = [...container.querySelectorAll(".ToDo:not(.dragging)")]

    return draggableElem.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset){
            return {offset: offset, element: child}
        }
        else{
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}



// card drop animation
document.addEventListener('click', (event) => {
    const btn = event.target.closest(".dropIcon");
    if (btn) {
        btn.classList.toggle("rotated");

        const todo = btn.closest(".ToDo");

        todo.classList.toggle("expanded");
    }
});


// prevents picking dates from past
document.querySelectorAll('input[type="date"]').forEach(cal => {
    cal.min = new Date().toISOString().slice(0, 10);
})

// toggle theme
let lightMode = localStorage.getItem("lightMode")

const toggleBtn = document.querySelector(".themeBtn")
const themeIcon = document.querySelector(".themeBtnIcon")


const main = document.querySelector("main")
const sidebar = document.querySelector(".sidebar")

const enableLightMode = () => {
    document.body.classList.add("lightMode")
    localStorage.setItem("lightMode", "active")

    themeIcon.style.fill = "rgba(13, 16, 23, 255)"
    themeIcon.style.transform = "rotate(0deg)"
    themeIcon.style.transition = "transform 0.5s ease-in-out, fill 0.2s ease-in-out"

    main.style.backgroundColor = "rgb(255, 236, 199)"
    sidebar.style.backgroundColor = "rgb(255, 236, 199)"

    main.style.transition = "background-color .5s ease"
    sidebar.style.transition = "background-color .5s ease"
}

const disableLightMode = () => {
    document.body.classList.remove("lightMode")
    localStorage.setItem("lightMode", null);

    themeIcon.style.fill = "rgb(255, 236, 199)"
    themeIcon.style.transform = "rotate(180deg)"
    themeIcon.style.transition = "transform 0.5s ease-in-out, fill 0.2s ease-in-out"

    main.style.transition = "background-color .5s ease"
    sidebar.style.transition = "background-color .5s ease"

    main.style.backgroundColor = "rgba(13, 16, 23, 255)"
    sidebar.style.backgroundColor = "rgba(13, 16, 23, 255)"
}

const loadLightMode = () => {
    document.body.classList.add("lightMode")

    themeIcon.style.fill = "rgba(13, 16, 23, 255)"
    themeIcon.style.transform = "rotate(0deg)"

    main.style.backgroundColor = "rgb(255, 236, 199)"
    sidebar.style.backgroundColor = "rgb(255, 236, 199)"
}

const loadDarkMode = () => {
    
    themeIcon.style.fill = "rgb(255, 236, 199)"
    themeIcon.style.transform = "rotate(180deg)"

    main.style.backgroundColor = "rgba(13, 16, 23, 255)"
    sidebar.style.backgroundColor = "rgba(13, 16, 23, 255)"
}

lightMode === "active" ? loadLightMode() : loadDarkMode()

toggleBtn.addEventListener("click", () => {
    lightMode = localStorage.getItem("lightMode")
    lightMode !== "active" ? enableLightMode() : disableLightMode()
});





// const defaultProject = {
//     creationDate: new Date().toISOString(),
//     deadlineDate: "2026-04-15T00:00:00.000Z",
//     description: "Default project description",
//     postponeDate: "2026-04-15T00:00:00.000Z",
//     previousDeadline: "2025-03-29T00:00:00.000Z",
//     projectPriority: "top",
//     title: "Default Project",
//     todos: {},
//     uniqueID: "project_000001",
// };

// // Check if the app has already been initialized
// if (!localStorage.getItem("appInitialized")) {
//     localStorage.setItem("project_000001", JSON.stringify(defaultProject));
//     localStorage.setItem("appInitialized", "true");
// }

// Project section
loadProjectList()
if(selectedProjectID == null){
    const main = document.querySelector("main")
    const childs = Array.from(main.children)
    childs.forEach(child => {
        child.style.display = "none";
        
    })
    main.style.display = "flex";
    document.querySelector(".CTAText").style.display = "inline";
}

// Project event
const createProjectBtn = document.querySelector(".addProjectBtn");
const editProjectBtn = document.querySelector(".editProjectBtn");
const deleteProjectBtn = document.querySelector(".deleteProjectBtn");
const postponeBtn = document.querySelector(".postponeBtn");

createProjectBtn.addEventListener("click", createProject);
editProjectBtn.addEventListener("click", editProject);
deleteProjectBtn.addEventListener("click", deleteProject);
postponeBtn.addEventListener("click", postpone);


// todo Event
const createTodoBtn = document.querySelector(".addTodoBtn")

createTodoBtn.addEventListener("click", createTodo)

document.addEventListener("click", (e) => {
    if(e.target.closest(".editTodoBtn")){
        const todoCardClass = e.target.closest(".ToDo").classList[1]
        editTodo(todoCardClass)
    }
    if(e.target.closest(".deleteTodoBtn")){
        const todoCardClass = e.target.closest(".ToDo").classList[1]
        deleteTodo(todoCardClass)
    }
})




document.addEventListener("change", (e) => {
    if(e.target.matches("input[type='checkbox']")){

        const todoDiv = e.target.closest(".ToDo");
        const todoClass = todoDiv.classList[1];

        const projectObject = JSON.parse(localStorage.getItem(selectedProjectID));
        const todoList = projectObject.todos;
        const selecedTodo = todoList[todoClass];

        selecedTodo["progress"] = e.target.checked ? "true" : "false";

        projectObject["todos"] = todoList;

        localStorage.setItem(selectedProjectID, JSON.stringify(projectObject))
    }
})





