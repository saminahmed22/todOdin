function serialization(map){

    if (map === null) { 
        throw new Error(`Arr null: ${map}`);
    }

    return JSON.stringify(Array.from(map, ([key, value]) => 
        [key, value instanceof Map ? Array.from(value) : value]
    ))
}


function deSerialization(arr){

    if (arr === null) { 
        throw new Error(`Arr null: ${arr}`);
    }

    const parsedArr = JSON.parse(arr)
    return new Map(parsedArr.map(([key, value]) => 
        [key, Array.isArray(value) ? new Map(value) : value]
    ))
}

function setLocalStorage(key, value){
    localStorage.setItem(key, value)

    console.log(`${key} has been added to local storage as key`)
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


export {serialization, deSerialization, setLocalStorage, getLocalStorage, deleteLocalStorage}