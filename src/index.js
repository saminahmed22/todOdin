import "./styles.css";
import {createProject, editProject, deleteProject, postpone, loadProjectList, selectedProjectID} from "./modules/project"
import {createTodo, editTodo, deleteTodo, loadTodos} from "./modules/todo"
import {deSerialization, getLocalStorage, serialization, setLocalStorage} from "./modules/helper";


// Drag Logic
const container = document.querySelector(".todoList")

// document.addEventListener('mousedown', (event) => {
//     const dragIcon = event.target.closest(".dragIcon");
//     if (!dragIcon) return;
    
//     const draggable = dragIcon.closest(".ToDo");
//     if (draggable) {
//         draggable.setAttribute("draggable", "true");
//     }
// });

// document.addEventListener('mouseup', (event) => {
//     const dragIcon = event.target.closest(".dragIcon");
//     if (!dragIcon) return;

//     const draggable = dragIcon.closest(".ToDo");
//     if (draggable) {
//         draggable.setAttribute("draggable", "false");
//     }
// });

// document.addEventListener('dragstart', (event) => {
//     const draggable = event.target.closest(".ToDo");
//     if (draggable) {
//         draggable.classList.add('dragging');
//     }
// });

// document.addEventListener('dragend', (event) => {
//     const draggable = event.target.closest(".ToDo");
//     if (draggable) {
//         draggable.classList.remove('dragging');
//         draggable.setAttribute("draggable", "false");
//     }
// });

// container.addEventListener('dragover', e =>{
//     e.preventDefault()
//     const afterelem = getDragAfterElement(e.clientY)
//     const draggable = document.querySelector(".dragging")
//     if (afterelem == null) {
//         container.appendChild(draggable)
//     }
//     else{
//         container.insertBefore(draggable, afterelem)
//     }
// })




// function getDragAfterElement(y){
//     const draggableElem = [...container.querySelectorAll(".ToDo:not(.dragging)")]

//     return draggableElem.reduce((closest, child) => {
//         const box = child.getBoundingClientRect()
//         const offset = y - box.top - box.height / 2;
//         if (offset < 0 && offset > closest.offset){
//             return {offset: offset, element: child}
//         }
//         else{
//             return closest
//         }
//     }, { offset: Number.NEGATIVE_INFINITY }).element
// }



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





const dummyProject = new Map([
    ["title", "World Domination"],
    ["description", "Gather cats do stuffs Idk"],
    ["deadlineDate", "2026-04-01T00:00:00.000Z"],
    ["projectPriority", "top"],
    ["creationDate", "2025-04-02T21:51:01.385Z"],
    ["uniqueID", "project_722400"],
    ["todos", new Map([
        ["Todo_1", {
            title: "Gather cats",
            desc: "those shits won't listen so force them ig",
            priority: "top",
            progress: false
        }],
        ["Todo_2", {
            title: "PET THEM",
            desc: "pet pet pet",
            priority: "top",
            progress: false
        }],
        ["Todo_4", {
            title: "Get a life",
            desc: "meh",
            priority: "normal",
            progress: false
        }],
        ["Todo_3", {
            title: "oh yeah, world domination",
            desc: "we'll see that later",
            priority: "low",
            progress: false
        }]
    ])],
    ["postponeDate", null],
    ["previousDeadline", "2026-04-01T00:00:00.000Z"]
]);

// Check if the app has already been initialized
if (!localStorage.getItem("appInitialized")) {
    setLocalStorage("project_000001", serialization(dummyProject))
    localStorage.setItem("appInitialized", "true");
}

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


document.addEventListener("click", (event) => {
    // project event
    if(event.target.matches(".addProjectBtn")){
        createProject();
        
    }
    else if(event.target.closest(".editProjectBtn")){
        editProject();
    }
    else if(event.target.closest(".deleteProjectBtn")){
        deleteProject();
    }
    else if(event.target.matches(".postponeBtn")){
        postpone();
    }

    // todo event
    else if (event.target.matches(".addTodoBtn")){
        createTodo()
    }
    else if (event.target.closest(".editTodoBtn")){
        const todoCardClass = event.target.closest(".ToDo").classList[1]
        editTodo(todoCardClass)
    }
    else if (event.target.closest(".deleteTodoBtn")){
        const todoCardClass = event.target.closest(".ToDo").classList[1]
        deleteTodo(todoCardClass)
    }
});



document.addEventListener("change", (e) => {
    if(e.target.matches("input[type='checkbox']")){

        const todoDiv = e.target.closest(".ToDo");
        const todoClass = todoDiv.classList[1];

        const projectMap = deSerialization(getLocalStorage(selectedProjectID));
        const todoList = projectMap.get("todos");
        const selecedTodoObject = todoList.get(todoClass);

        selecedTodoObject["progress"] = e.target.checked;

        projectMap.set("todos", todoList)

        setLocalStorage(selectedProjectID, serialization(projectMap))
        loadTodos()
    }
})