import { format, differenceInDays, differenceInHours, addHours } from 'date-fns'

const overlay = document.querySelector(".overlay")

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
    overlay.style.display = "inline";
    
    projectCreateForm.removeEventListener("submit", createProjectSubmit)
    projectCreateForm.addEventListener("submit", createProjectSubmit)

    projectCreateModal.querySelector(".cancelBtn").addEventListener("click", () => {
        projectCreateModal.close();
        projectCreateForm.reset()
        overlay.style.display = "none";
        projectCreateForm.removeEventListener("submit", createProjectSubmit)
    })
}


function createProjectSubmit(e){
    e.preventDefault();


    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    projectCreateModal.close();
    overlay.style.display = "none";
    projectCreateForm.reset();

    const uniqueID = `project_${Math.floor(Math.random() * 1000000)}`
    // const date = new Date();
    formValues["creationDate"] = new Date(); //format(date, "yyyy-MM-dd, h:mm a");
    formValues["uniqueID"] = uniqueID;
    formValues["todos"] = {};

    localStorage.setItem(uniqueID, JSON.stringify(formValues));
    loadProjectList();
}










// ****************************************************************************************************************************

function editProject(){
    projectEditModal.show();
    overlay.style.display = "inline";

    projectInfoLoad(selectedProjectID)

    projectEditForm.removeEventListener("submit", editProjectSubmit)
    projectEditForm.addEventListener("submit", editProjectSubmit)



    projectEditModal.querySelector(".cancelBtn").addEventListener("click", () => {
        projectEditModal.close();
        projectEditForm.reset();
        overlay.style.display = "none";
        projectEditForm.removeEventListener("submit", editProjectSubmit)
    })
}



function projectInfoLoad(projectID=selectedProjectID){

    const projectObject = JSON.parse(localStorage.getItem(projectID))

    const projectTitle = projectObject.title;
    const projectDesc = projectObject.description;
    const projectPriority = projectObject.projectPriority;

    
    let titleInput = projectEditForm.querySelector("#editProjectTitle")
    let DescInput = projectEditForm.querySelector("#editProjectDesc")
    let pirorityInput = projectEditForm.querySelector("#editProjectPriority")

    titleInput.value = projectTitle;
    DescInput.value = projectDesc;
    pirorityInput.value = projectPriority;
}

// add form reset at the end
function editProjectSubmit(e, projectID=selectedProjectID){
    e.preventDefault()

    const projectObject = JSON.parse(localStorage.getItem(projectID))

    console.log(`Object: ${JSON.stringify(projectObject)}`)


    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    projectObject["title"] = formValues.editTitle;
    projectObject["description"] = formValues.editDesc;
    projectObject["projectPriority"] = formValues.editPriority;


    console.log(`From Values Object: ${JSON.stringify(formValues)}`)
    console.log(`Updated Object: ${JSON.stringify(projectObject)}`)

    localStorage.setItem(projectID, JSON.stringify(projectObject))

    console.log(formValues);

    loadProjectList()
    loadProjectMain()

    projectEditModal.close();
    projectEditForm.reset()
    overlay.style.display = "none";
}


























// ****************************************************************************************************************************
function deleteProject(){
    projectDeleteModal.show();
    overlay.style.display = "inline";
    projectDeleteForm.addEventListener("submit", e => {

        e.preventDefault()
        projectDeleteModal.close();
        projectDeleteForm.reset();
        overlay.style.display = "none";

        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());

        console.log(formValues);
    })

    projectDeleteModal.querySelector(".cancelBtn").addEventListener("click", () => {
        projectDeleteModal.close();
        projectDeleteForm.reset()
        overlay.style.display = "none";
    })
}



function postpone(){

    postponeModal.show();
    overlay.style.display = "inline";

    postponeForm.addEventListener("submit", e => {
        e.preventDefault();
        postponeModal.close();
        postponeForm.reset();
        overlay.style.display = "none";

        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());


        console.log(JSON.stringify(formValues));
    })

    postponeModal.querySelector(".cancelBtn").addEventListener("click", () => {
        postponeModal.close();
        postponeForm.reset()
        overlay.style.display = "none";
    })
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
        const projectA = JSON.parse(localStorage.getItem(a));
        const projectB = JSON.parse(localStorage.getItem(b));
        
        const d1 = new Date(projectA.creationDate)
        const d2 = new Date(projectB.creationDate)

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
        const projectObject = JSON.parse(localStorage.getItem(ID));

        const listItem = document.createElement("li")

        const projectListDiv = document.createElement("div")
        projectListDiv.setAttribute("id",`${ID}_Div`)
        projectListDiv.classList.add("projectSidebar")

        const projectListTitle = document.createElement("h5")
        projectListTitle.textContent = projectObject.title;


        const projectListPriority = document.createElement("div");
        projectListPriority.classList.add("pirorityMark");

        
        const pirority = projectObject.projectPriority;

        let colorCode = null;
        if(pirority == "top"){
            colorCode = "red";
        }
        else if(pirority == "low"){
            colorCode = "green";
        }
        else{
            colorCode = "gold";
        }
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
            document.querySelector("main").style.display = "block";
            document.querySelector(".CTAText").style.display = "none";
            loadProjectMain(selectedProjectID);
        })
    })
}



// load project into the main section
function loadProjectMain(projectID=selectedProjectID){

    // project object from local storage
    const projectObject= JSON.parse(localStorage.getItem(projectID))

    const title = projectObject.title;
    const desc = projectObject.description;
    const createDate = projectObject.creationDate

    let deadlineDate = projectObject.deadlineDate;
    let deadlineDateModified;

    if( deadlineDate != ""){
        deadlineDate = addHours(new Date(projectObject.deadlineDate).toISOString(), 17)
        deadlineDateModified = `Deadline: ${format(deadlineDate, "EEEE, MMMM dd, yyyy (h:mm a) | ")}${timeRemaining()}`;        
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

    console.log(JSON.stringify(projectObject))

    console.log(createDateModified)
    console.log(deadlineDateModified)

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
export {createProject, editProject, deleteProject, postpone, loadProjectList, selectedProjectID}