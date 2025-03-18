import {loadHome} from "./modules/home"
import {loadMenu} from "./modules/menu"
import {loadContact} from "./modules/contact"

import "./styles.css";

const contentDiv = document.querySelector(".content")

const homeBtn = document.querySelector(".homeBtn");
const menuBtn = document.querySelector(".menuBtn");
const contactBtn = document.querySelector(".contactBtn");


loadHome();
homeBtn.addEventListener("click", () => {
    contentDiv.textContent = '';
    loadHome();
})

menuBtn.addEventListener("click", () => {
    contentDiv.textContent = '';
    loadMenu();
})

contactBtn.addEventListener("click", () => {
    contentDiv.textContent = '';
    loadContact();
})