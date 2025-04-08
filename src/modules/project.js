import {format, differenceInDays, differenceInHours, addDays, addWeeks, addMonths, addYears, endOfDay, intervalToDuration, startOfDay} from 'date-fns'
import {loadTodos, resetTodos} from "./todo";
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


const repeatCount = document.getElementById("repeatCount");
const repeatMeasure = document.getElementById("repeatMeasure");

const projectDeadline = document.getElementById("projectDeadline");



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

        repeatCount.style.display = "none";
        repeatMeasure.style.display = "none";
        projectDeadline.style.display = "inline"

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

    let deadline;
    if(formValues.get("projectType") == "repeating"){
        
        const measure = formValues.get("repeatMeasure")
        const createDate = startOfDay(new Date()).toISOString()
        const repeatCount = parseInt(formValues.get("repeatCount"))
        
        if(measure == "days"){
            deadline = addDays(createDate, repeatCount)
        }
        else if(measure == "week"){
            deadline = addWeeks(createDate, repeatCount)
        }
        else if(measure == "month"){
            deadline = addMonths(createDate, repeatCount)
        }
        else if(measure == "year"){
            deadline = addYears(createDate, repeatCount)
        }

    }
    else{
        deadline = formValues.get("deadlineDate") != ""? endOfDay(new Date(formValues.get("deadlineDate"))).toISOString() : null;
    }
    formValues.set("deadlineDate", deadline)
    formValues.set("previousDeadline", deadline)
    
    setLocalStorage(uniqueID, serialization(formValues))


    loadProjectList();
    loadNewProject(uniqueID);
    projectCreateModal.close();


    repeatCount.style.display = "none";
    repeatMeasure.style.display = "none";
    projectDeadline.style.display = "inline"
        

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
let currentDeadline;
function postpone(){

    postponeModal.show();
    overlayDiv.style.display = "inline"

    const projectMap =  deSerialization(getLocalStorage(selectedProjectID))

    currentDeadline = projectMap.get("deadlineDate") ? projectMap.get("deadlineDate") : new Date();
    projectMap.set("previousDeadline", currentDeadline);
 

    postponeForm.querySelectorAll('input[type="date"]').forEach(cal => {
        let minDate = new Date(addDays(currentDeadline, 1));
        cal.min = minDate.toISOString().slice(0, 10);
    });

    postponeForm.removeEventListener("submit", postponeSubmission)
    postponeForm.addEventListener("submit", postponeSubmission)




    postponeModal.querySelector(".cancelBtn").addEventListener("click", () => {
        postponeModal.close();
        postponeForm.reset()
        overlayDiv.style.display = "none"
        postponeForm.removeEventListener("submit", postponeSubmission)
    })
}

function postponeSubmission(e){
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

        if(projectMap.get("projectType") == "repeating"){
            const repeatIcon = '<svg class = "repeatIcon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"/></svg>'
            projectListTitle.innerHTML += repeatIcon
        }

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
        if(child.classList.contains("todoBtnContainer") || child.classList.contains("todoListContainer")){
            child.style.display = "flex";
        }
        else{
            child.style.display = "block";
        }
    })

    document.querySelector(".CTAText").style.display = "none";

    let projectMap = deSerialization(getLocalStorage(selectedProjectID))

    const title = projectMap.get("title");
    const desc = projectMap.get("description");
    const createDate = projectMap.get("creationDate");
    const projectType = projectMap.get("projectType");


    let refreshStatus = null
    if(projectType == "repeating"){
        refreshStatus = repeatProject();
    }
    loadTodos()

    // get refreshed map
    projectMap = deSerialization(getLocalStorage(selectedProjectID))


    const createDateModified = `Creation date: ${format(createDate, "EEEE, MMMM dd, yyyy (h:mm a)")}`;
    deadline()

    // main selectors
    const projectTitleMain = document.querySelector(".ProjectTitle")
    const projectDescMain = document.querySelector(".projectDesc")
    const creationDateMain = document.querySelector(".projectDate")


    projectTitleMain.textContent = title;
    projectDescMain.textContent = desc;
    creationDateMain.textContent = createDateModified;

    showNotice(refreshStatus)
}


function deadline(){
    if(!selectedProjectID) return;

    const projectMap = deSerialization(getLocalStorage(selectedProjectID))

    const postponeDate = projectMap.get("postponeDate");
    const deadlineDate = projectMap.get("deadlineDate");
    const previousDeadline = projectMap.get("previousDeadline");

    let deadlineString;

    if( deadlineDate != null && postponeDate == null){
        deadlineString = deadlineDate ? `Deadline: ${format(deadlineDate, "EEEE, MMMM dd, yyyy (h:mm a)")} | ${timeRemaining()}` : '';
    }
    else{
        function difference(){
            const difference = intervalToDuration({ start: previousDeadline, end: deadlineDate })
            for(let [key, value] of Object.entries(difference)){
                if(value){
                    return `${value} ${value > 1 ? key : key.slice(0, -1)}`
                }
            }
        }
        deadlineString = `Deadline(has been Postponed for ${difference()}): ${format(deadlineDate, "EEEE, MMMM dd, yyyy (h:mm a)")} | ${timeRemaining()}`;
    }


    function timeRemaining() {

        const now = new Date().toISOString()
        const interval = intervalToDuration({ start: now, end: deadlineDate }) 

        const isPassed = now > deadlineDate;

        console.clear()
        console.log(JSON.stringify(interval))

        if(!isPassed){
            for(let [key, value] of Object.entries(interval)){
                if(value){
                    return `${value} ${value > 1 ? key : key.slice(0, -1)} left`
                }
            }
        }
        else{
            for(let [key, value] of Object.entries(interval)){
                if(value){
                    return `Deadline has passed ${Math.abs(value)} ${Math.abs(value) > 1 ? key : key.slice(0, -1)} ago`
                }
            }
        }
    }
    const deadlineDateMain = document.querySelector(".projectDeadlineDate")
    deadlineDateMain.textContent = deadlineString;
}
setInterval(deadline, 1000);


function repeatProject(){

    const projectMap = deSerialization(getLocalStorage(selectedProjectID))

    let deadline;
    const measure = projectMap.get("repeatMeasure")
    const currentDate = new Date().toISOString()
    const repeatCount = parseInt(projectMap.get("repeatCount"))
    let currentDeadline = projectMap.get("deadlineDate")

    let difference = differenceInHours(currentDeadline, currentDate)

    if(difference < 0){
        while(difference < 0){
            if(measure === "days"){
                deadline = addDays(currentDeadline, repeatCount)
            }
            else if(measure === "week"){
                deadline = addWeeks(currentDeadline, repeatCount)
            }
            else if(measure === "month"){
                deadline = addMonths(currentDeadline, repeatCount)
            }
            else if(measure === "year"){
                deadline = addYears(currentDeadline, repeatCount)
            }
            currentDeadline = deadline
            difference = differenceInHours(currentDeadline, currentDate)
        }

        projectMap.set("deadlineDate", deadline.toISOString())
        projectMap.set("previousDeadline", deadline.toISOString())
    
        setLocalStorage(selectedProjectID, serialization(projectMap))
        resetTodos(selectedProjectID)

        return true
    }

    const projectRepeat = document.querySelector(".projectRepeat")
    projectRepeat.style.display = "inline";
    projectRepeat.textContent = `Repeats every ${repeatCount} ${measure == "days" && repeatCount > 1 ? measure : measure.slice(0, -1)}`

    return false
}


function showNotice(bool){
    const notice = document.querySelector(".notice")
    if(bool){
        notice.style.visibility = "visible";
        notice.classList.add("show");
        setTimeout(() => {
            notice.classList.remove("show");
        }, 10000);
        setTimeout(() => {
            notice.style.visibility = "hidden";
        }, 11000);
    }
}

// ************************************************************************************
export {createProject, editProject, deleteProject, postpone, loadProjectList, projectListListener, selectedProjectID}