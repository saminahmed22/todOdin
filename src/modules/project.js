import {format, differenceInDays, differenceInHours, addDays} from 'date-fns'
import {loadTodos} from "./todo";
import {serialization, deSerialization, setLocalStorage, getLocalStorage, deleteLocalStorage} from "./helper"

let overlayDiv = document.querySelector(".overlay")

const projectCreateModal = document.querySelector(".createProjectModal");
const projectCreateForm = document.querySelector("#createProjectForm");

const projectEditModal = document.querySelector(".editProjectModal");
const projectEditForm = document.querySelector("#editProjectForm");

const projectDeleteModal = document.querySelector(".deleteProjectModal");
const projectDeleteForm = document.querySelector("#deleteProjectForm");

const postponeModal = document.querySelector(".postponeModal");
const postponeForm = document.querySelector("#postponeForm");


let selectedProjectID = null;


function createProject(){
    projectCreateModal.show();
    overlayDiv.style.display = "inline"
    
    projectCreateForm.removeEventListener("submit", createProjectSubmit)
    projectCreateForm.addEventListener("submit", createProjectSubmit)

    projectCreateModal.querySelector(".cancelBtn").addEventListener("click", () => {
        projectCreateModal.close();
        projectCreateForm.reset()
        overlayDiv.style.display = "none"
        projectCreateForm.removeEventListener("submit", createProjectSubmit)
    })
}


function createProjectSubmit(e){
    e.preventDefault();


    const formData = new FormData(e.target);
    const formValues = new Map(formData.entries());



    const uniqueID = `project_${Math.floor(Math.random() * 1000000)}`
    
    formValues.set("creationDate", new Date().toISOString());
    formValues.set("uniqueID", uniqueID);
    formValues.set("todos", new Map());
    formValues.set("postponeDate", null);

    const updatedDeadline = formValues.get("deadlineDate") != ""? new Date(formValues.get("deadlineDate")).toISOString() : null;

    formValues.set("deadlineDate", updatedDeadline)
    formValues.set("previousDeadline", updatedDeadline)

    setLocalStorage(uniqueID, serialization(formValues))


    loadProjectList();
    loadNewProject(uniqueID);
    projectCreateModal.close();
    overlayDiv.style.display = "none"
    projectCreateForm.reset();
}



// ****************************************************************************************************************************

function editProject(){
    projectEditModal.show();
    overlayDiv.style.display = "inline"

    projectInfoLoad(selectedProjectID)

    projectEditForm.removeEventListener("submit", editProjectSubmit)
    projectEditForm.addEventListener("submit", editProjectSubmit)



    projectEditModal.querySelector(".cancelBtn").addEventListener("click", () => {
        projectEditModal.close();
        projectEditForm.reset();
        overlayDiv.style.display = "none"
        projectEditForm.removeEventListener("submit", editProjectSubmit)
    })
}


function projectInfoLoad(){

    const projectMap = new Map(JSON.parse(localStorage.getItem(selectedProjectID)))

    const projectTitle = projectMap.get("title");
    const projectDesc = projectMap.get("description");
    const projectPriority = projectMap.get("projectPriority");

    
    let titleInput = projectEditForm.querySelector("#editProjectTitle")
    let DescInput = projectEditForm.querySelector("#editProjectDesc")
    let priorityInput = projectEditForm.querySelector("#editProjectPriority")

    titleInput.value = projectTitle;
    DescInput.value = projectDesc;
    priorityInput.value = projectPriority;
}


function editProjectSubmit(e){
    e.preventDefault()

    const projectMap =  deSerialization(getLocalStorage(selectedProjectID))

    const formData = new FormData(e.target);
    const formValues = new Map(formData.entries());

    projectMap.set("title", formValues.get("editTitle"));
    projectMap.set("description", formValues.get("editDesc"));
    projectMap.set("projectPriority", formValues.get("editPriority"));

    setLocalStorage(selectedProjectID, serialization(projectMap));

    loadProjectList()
    loadProjectMain()

    projectEditModal.close();
    projectEditForm.reset()
    overlayDiv.style.display = "none"
}



// ****************************************************************************************************************************

function deleteProject(){

    projectDeleteModal.show();
    overlayDiv.style.display = "inline"


    const projectMap = deSerialization(getLocalStorage(selectedProjectID))

    const modalTitle = projectDeleteModal.querySelector("h5")

    const projectTitle = projectMap.get("title");

    modalTitle.textContent = projectTitle;

    projectDeleteForm.removeEventListener("submit", deleteProjectSubmit)
    projectDeleteForm.addEventListener("submit", deleteProjectSubmit)

    projectDeleteModal.querySelector(".cancelBtn").addEventListener("click", () => {
        projectDeleteModal.close();
        overlayDiv.style.display = ""
        projectDeleteForm.removeEventListener("submit", deleteProjectSubmit)
    })
}

function deleteProjectSubmit(e){
    e.preventDefault()

    deleteLocalStorage(selectedProjectID)

    selectedProjectID = null;
    loadProjectList()

    const main = document.querySelector("main")
    const childs = Array.from(main.children)
    childs.forEach(child => {
        child.style.display = "none";
    })
    main.style.display = "flex";
    document.querySelector(".CTAText").style.display = "inline";
    

    projectDeleteModal.close();
    overlayDiv.style.display = "none"
}



// ****************************************************************************************************************************

function postpone(){

    postponeModal.show();
    overlayDiv.style.display = "inline"

    const projectMap =  deSerialization(getLocalStorage(selectedProjectID))

    const currentDeadline = projectMap.get("deadlineDate") ? projectMap.get("deadlineDate") : new Date();
    projectMap.set("previousDeadline", currentDeadline);
 

    postponeForm.querySelectorAll('input[type="date"]').forEach(cal => {
        let minDate = new Date(addDays(currentDeadline, 1));
        cal.min = minDate.toISOString().slice(0, 10);
    });

    postponeForm.removeEventListener("submit", postponeSubmission)
    postponeForm.addEventListener("submit", (e) => postponeSubmission(e, currentDeadline))




    postponeModal.querySelector(".cancelBtn").addEventListener("click", () => {
        postponeModal.close();
        postponeForm.reset()
        overlayDiv.style.display = "none"
        postponeForm.removeEventListener("submit", postponeSubmission)
    })
}

function postponeSubmission(e, currentDeadline){
    e.preventDefault();

    const projectMap =  deSerialization(getLocalStorage(selectedProjectID))

    const formData = new FormData(e.target);
    const formValues = new Map(formData.entries());

    const postponeDate = new Date(formValues.get("postponeDate")).toISOString();

    const diff = differenceInDays(postponeDate, currentDeadline)

    const updatedDeadline = addDays(currentDeadline, diff)

    
    projectMap.set("deadlineDate", updatedDeadline);
    projectMap.set("postponeDate", postponeDate);

    setLocalStorage(selectedProjectID, serialization(projectMap));

    loadProjectList();
    loadProjectMain();

    postponeModal.close();
    postponeForm.reset();
    overlayDiv.style.display = "none"
}



// ************************************************************************************

// Project DOM


// load projects in the sidebar
function loadProjectList(){
    
    // Get all project IDs from localStorage
    let projectIDs = []

    const IDarrayLen = localStorage.length
    for(let i = 0; i <= IDarrayLen - 1; i++){
        const ID = localStorage.key(i)
        
        if(ID.includes("project")){
            projectIDs.push(ID)
        }
    }
    // sort projectIDs array into reverse chronological order
    projectIDs.sort((a, b) => {
        const projectA = deSerialization(getLocalStorage(a));
        const projectB = deSerialization(getLocalStorage(b));
        
        const d1 = new Date(projectA.get("creationDate"))
        const d2 = new Date(projectB.get("creationDate"))

        if(d1 < d2){
            return 1;
        }
        if(d1 > d2){
            return -1;
        }
    })

    // add projects into the sidebar
    const orderedList = document.querySelector(".projectOrderedList");
    orderedList.textContent = "";

    projectIDs.forEach(ID => {
        const projectMap = deSerialization(getLocalStorage(ID))

        const listItem = document.createElement("li")

        const projectListDiv = document.createElement("div")
        projectListDiv.setAttribute("id",`${ID}_Div`)
        projectListDiv.classList.add("projectSidebar")

        const projectListTitle = document.createElement("h5")
        projectListTitle.textContent = projectMap.get("title");


        const projectListPriority = document.createElement("div");
        projectListPriority.classList.add("pirorityMark");

        
        const pirority = projectMap.get("projectPriority");


        let colorCode = pirority == "top" ? "red" : (pirority == "low" ? "green" : "gold");
        projectListPriority.style.backgroundColor = colorCode;

        projectListDiv.appendChild(projectListTitle)
        projectListDiv.appendChild(projectListPriority)

        listItem.appendChild(projectListDiv)

        orderedList.appendChild(listItem)
    })

    projectListListener()
}

function projectListListener(){

    const projectListDivs = document.querySelectorAll(".projectSidebar")

    projectListDivs.forEach(div => {
        div.addEventListener("click", () => {
            const previousProject = document.querySelector(".selectedProject")

            if(previousProject === null){
                div.classList.add("selectedProject")
            }
            else{
                previousProject.classList.remove("selectedProject")
                div.classList.add("selectedProject")
            }
            selectedProjectID = div.id.slice(0, -4);

            loadTodos()
            loadProjectMain();
            return selectedProjectID;
        })
    })
}

function loadNewProject(newProjectID){
    // change selected project ID to new project ID,
    selectedProjectID = newProjectID
    const newDiv = document.getElementById(`${newProjectID}_Div`)
    newDiv.classList.add("projectSidebar")

    const previousProject = document.querySelector(".selectedProject")

    if(previousProject === null){
        newDiv.classList.add("selectedProject")
    }
    else{
        previousProject.classList.remove("selectedProject")
        newDiv.classList.add("selectedProject")
    }
    loadTodos()
    loadProjectMain()
    return selectedProjectID;
}

// load project into the main section
function loadProjectMain(){

    // enable childrens in main and disable cta text
    const main = document.querySelector("main")
    main.style.display = "block";

    const childs = Array.from(main.children)
    childs.forEach(child => {
        child.style.display = "block";
    })

    document.querySelector(".CTAText").style.display = "none";



    const projectMap = deSerialization(getLocalStorage(selectedProjectID))

    const title = projectMap.get("title");
    const desc = projectMap.get("description");
    const createDate = projectMap.get("creationDate");
    const postponeDate = projectMap.get("postponeDate");
    const previousDeadline = projectMap.get("previousDeadline");

    let deadlineDate = projectMap.get("deadlineDate");
    let deadlineDateModified;



    if( deadlineDate != null && postponeDate == null){
        // deadlineDate = projectMap.get("deadlineDate")
        deadlineDateModified = `Deadline: ${format(deadlineDate, "EEEE, MMMM dd, yyyy (h:mm a) | ")}${timeRemaining()}`;  
    }
    else if(postponeDate != null){

        function difference(){
            const diff = differenceInDays(postponeDate, previousDeadline);
            if(diff <= 1){
                return `${diff} day`
            }
            else{
                return `${diff} days`
            }
        }

        deadlineDateModified = `Deadline(Postponed for ${difference()}): ${format(deadlineDate, "EEEE, MMMM dd, yyyy (h:mm a) | ")}${timeRemaining()}`;
    }
    else{
        deadlineDateModified = "";
    }
    

    function timeRemaining() {
        const diff = differenceInDays(deadlineDate, new Date());
        const hourDiff = differenceInHours(deadlineDate, new Date())
        if(diff > 1){
            return `${diff} days left`
        }
        else if(diff == 1){
            return `${diff} day left`
        }
        else if(diff == 0 && hourDiff > 0){

            if(hourDiff <= 1){
                return `${hourDiff} hour left`
            }
            else{
                return `${hourDiff} hours left`
            }
        }
        else{
            if(hourDiff < 23){
                if(hourDiff <= 1){
                    return `Deadline has passed ${Math.abs(hourDiff)} hour ago`
                }
                else{
                    return `Deadline has passed ${Math.abs(hourDiff)} hours ago`
                }
            }
            else{
                return `Deadline has passed ${Math.abs(diff)} days ago`
            }   
        }
    }

    const createDateModified = `Creation date: ${format(createDate, "EEEE, MMMM dd, yyyy (h:mm a)")}`;


    // main selectors
    const projectTitleMain = document.querySelector(".ProjectTitle")
    const projectDescMain = document.querySelector(".projectDesc")
    const creationDateMain = document.querySelector(".projectDate")
    const deadlineDateMain = document.querySelector(".projectDeadlineDate")

    projectTitleMain.textContent = title;
    projectDescMain.textContent = desc;
    creationDateMain.textContent = createDateModified;
    deadlineDateMain.textContent = deadlineDateModified;
}

// ************************************************************************************
export {createProject, editProject, deleteProject, postpone, loadProjectList, projectListListener, selectedProjectID}