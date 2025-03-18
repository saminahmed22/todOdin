const contentBody = document.querySelector(".content");


function loadContact(){
    const formDiv = document.createElement("div");
    formDiv.className = "formDiv"

    const form = document.createElement('form');


    const nameLabel = document.createElement('label')
    nameLabel.htmlFor = "name";
    nameLabel.innerHTML = "Name<br>"

    const nameInput = document.createElement("input")
    nameInput.type = "text";
    nameInput.id = "name"
    nameInput.name = "name"
    nameInput.required = true;

    form.appendChild(nameLabel)
    form.appendChild(nameInput)



    const emailLabel = document.createElement('label')
    emailLabel.htmlFor = "email";
    emailLabel.innerHTML = "<br>Email<br>"

    const emailInput = document.createElement("input")
    emailInput.type = "email";
    emailInput.id = "email"
    emailInput.name = "email"
    emailInput.required = true;

    form.appendChild(emailLabel)
    form.appendChild(emailInput)



    const phLabel = document.createElement('label')
    phLabel.htmlFor = "ph";
    phLabel.innerHTML = "<br>Phone<br>"

    const phInput = document.createElement("input")
    phInput.type = "number";
    phInput.id = "ph"
    phInput.name = "ph"

    form.appendChild(phLabel)
    form.appendChild(phInput)

 
    
    const messageLabel = document.createElement("label")
    messageLabel.htmlFor = "message";
    messageLabel.innerHTML = "<br>Additional information<br>"

    const messageInput = document.createElement("textarea")
    messageInput.id = "message";
    messageInput.name = "message"


    form.appendChild(messageLabel)
    form.appendChild(messageInput)

    const submitBtn = document.createElement("button")
    submitBtn.className = "submitBtn";
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit"
    form.appendChild(document.createElement("br"));
    form.appendChild(submitBtn);

    formDiv.appendChild(form);
    
 


    const infoDiv = document.createElement("div")
    infoDiv.className = "infoDiv";

    const infoHead = document.createElement("h2")
    infoHead.textContent = "Contact us at"
    infoDiv.appendChild(infoHead)

    const infophone = document.createElement("h5");
    infophone.className = "infoTitle";
    infophone.innerHTML = "<br>Phone: (555) 123-4567<br>";
    infoDiv.appendChild(infophone);

    const infoemail = document.createElement("h5");
    infoemail.className = "infoTitle";
    infoemail.innerHTML = "<br>Email: contact@odinres.com<br>";
    infoDiv.appendChild(infoemail);

    const infoaddress = document.createElement("h5");
    infoaddress.className = "infoTitle";
    infoaddress.innerHTML = "<br>Address: 123 Viking Street, Valhalla City, ON 98765<br>";
    infoDiv.appendChild(infoaddress);
 

    contentBody.appendChild(formDiv);
    contentBody.appendChild(infoDiv);

};

export {loadContact};