import noodleImage from '../images/noodle.png';


const contentDiv = document.querySelector(".content")

function loadHome(){

    const heroDiv = document.createElement("div")
    heroDiv.className = "hero";

    const imageDiv = document.createElement("div")
    imageDiv.className = "image"

    const homeHero = document.createElement("h3");
    homeHero.className = "homeHero";
    homeHero.textContent = "Step into the warmth of home-cooked tradition. Here, every dish is made with care, using time-honored recipes and the finest ingredients. From freshly baked bread to hearty, comforting meals, we bring the flavors of home to your table."
    heroDiv.appendChild(homeHero)

    const image = document.createElement('img');
    image.src = noodleImage;
    image.className = "homeImage";
    image.draggable = false;
    imageDiv.appendChild(image);

    contentDiv.appendChild(heroDiv)
    contentDiv.appendChild(imageDiv)
};

export {loadHome};