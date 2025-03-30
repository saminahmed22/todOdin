function serialization(arr){

    console.log(`Array sent in serialization = ${arr} `)

    return JSON.stringify(Array.from(arr, ([key, value]) => 
        [key, value instanceof Map ? Array.from(value) : value]
    ))
}


function deSerialization(arr){

    console.log(`Array sent in deSerialization = ${arr} `)

    const parsedArr = JSON.parse(arr)
    return new Map(parsedArr.map(([key, value]) => 
        [key, Array.isArray(value) ? new Map(value) : value]
    ))
}

function setLocalStorage(key, value){
    localStorage.setItem(key, value)

    console.log(`${key} has been added to local storage as key`)
    console.log(`${value} has been added to local storage as value`)    
}

function getLocalStorage(key){
    const item = localStorage.getItem(key);
    
    if (item === null) { 
        throw new Error(`No value found for key: ${key}`);
    }

    return item;
}

function deleteLocalStorage(key){
    localStorage.removeItem(key)
    
    console.log(`${key} has been removed from the local storage`)  
}

function overlay(){
    const overlayDiv = document.querySelector(".overlay")
    const currentDisplay = overlayDiv.style.display;
    overlayDiv.style.display = currentDisplay == "none" ? "inline" : "none";
}


export {serialization, deSerialization, setLocalStorage, getLocalStorage, deleteLocalStorage, overlay}