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

    if (key === null) { 
        throw new Error(`key null`);
    }
    else if (value === null) { 
        throw new Error(`value null`);
    }

    localStorage.setItem(key, value)
}

function getLocalStorage(key){

    const item = localStorage.getItem(key);
    return item;
}

function deleteLocalStorage(key){
    localStorage.removeItem(key)

    console.log(`${key} has been removed from the local storage`)  
}


export {serialization, deSerialization, setLocalStorage, getLocalStorage, deleteLocalStorage}