import {showFrom} from "./modules/forms";
import "./styles.css";
// Drag Logic starts here
const draggables = document.querySelectorAll(".ToDo");
const container = document.querySelector(".todoList")

draggables.forEach(draggable => {
    const dragIcon = draggable.querySelector(".dragIcon")

    dragIcon.addEventListener('mousedown', () => {
        draggable.setAttribute("draggable", "true")
    })

    dragIcon.addEventListener('mouseup', () => {
        draggable.setAttribute("draggable", "false")
    })  

    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
        draggable.setAttribute("draggable", "false");
    })
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
        console.log(offset)
        if (offset < 0 && offset > closest.offset){
            return {offset: offset, element: child}
        }
        else{
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element

}




// card drop animation
const expandBtns = document.querySelectorAll(".dropIcon")

expandBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        btn.classList.toggle("rotated");

        const todo = btn.closest(".ToDo");

        todo.classList.toggle("expanded");
    });
})

// prevents picking dates from past
document.querySelectorAll('input[type="date"]').forEach(cal => {
    cal.min = new Date().toISOString().slice(0, 10);
})


// Buttons
const addProjectBtn = document.querySelector(".addProjectBtn")
const addTodoBtn = document.querySelector(".addTodoBtn")
const postponeBtn = document.querySelector(".postponeBtn")
const projectEditBtn = document.querySelector(".projectEditBtn")
const projectDeleteBtn = document.querySelector(".projectDeleteBtn")

const todoEditBtn = document.querySelectorAll(".todoEditBtn")
const todoDeleteBtn = document.querySelectorAll(".todoDeleteBtn")


addProjectBtn.addEventListener("click", () => {
    showFrom("createProjectmodal");
})

addTodoBtn.addEventListener("click", () => {
    showFrom("createTodomodal");
})

postponeBtn.addEventListener("click", () => {
    showFrom("postponemodal");
})

projectEditBtn.addEventListener("click", () => {
    showFrom("editProjectmodal");
})

projectDeleteBtn.addEventListener("click", () => {
    showFrom("deleteProjectmodal");
})



todoEditBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        showFrom("editTodomodal");
    })
})

todoDeleteBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        showFrom("deleteTodomodal");
    })
})