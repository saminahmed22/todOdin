const contentBody = document.querySelector(".content");


const menuItem = {
    Ramen: {
        Tonkotsu: "Rich pork broth with chashu, egg, and scallions.",
        Shoyu: "Soy sauce-based broth with bamboo shoots and nori.",
        Miso: "Savory miso broth with corn, butter, and green onions."
    },
    Sides: {
        Gyoza: "Pan-fried dumplings (pork or vegetable).",
        Onigiri: "Rice balls (tuna mayo or salmon)."
    },
    Drinks: {
        Matcha: "Creamy green tea latte (hot or iced).",
        Ramune: "Japanese carbonated drink (various flavors)."
    }
};

function loadMenu(){
    const menuDiv = document.createElement("div");
    menuDiv.className = "menuDiv"

    Object.keys(menuItem).forEach(item => {
        if(menuDiv.getElementsByClassName(`${item}Div`).length === 0){
            const category = document.createElement("div")
            category.className = `${item}Div`;

            const categoryName = document.createElement("h3");
            categoryName.class = `${item}DivTitle`
            categoryName.textContent = item;
            category.appendChild(categoryName)

            Object.keys(menuItem[item]).forEach(dish => {
                const dishItem = document.createElement("div");
                dishItem.className = `${dish}Div`

                const dishName = document.createElement("h5");
                dishName.textContent = dish; // Use the dish name
                dishItem.appendChild(dishName);

                const dishDesc = document.createElement("p");
                dishDesc.textContent = menuItem[item][dish]
                dishItem.appendChild(dishDesc)

                category.appendChild(dishItem);
                
            });

            menuDiv.appendChild(category)
        }
    });
    contentBody.appendChild(menuDiv)
};

export {loadMenu};