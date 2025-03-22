const overlay = document.querySelector(".overlay")

function showform(modalID){

    const form = document.querySelector(`.${modalID}`)
    console.log(form)
    const cancelBtn = form.querySelector(".cancelSubmit")
    // const submitBtn = form.querySelector(".")
            
    form.show()

    overlay.style.display = "inline";


    cancelBtn.addEventListener("click", () => {
        form.close()
        overlay.style.display = "none";
        form.querySelector("form").reset();
    })

    form.addEventListener("submit", e => {
        e.preventDefault();
        overlay.style.display = "none";
        form.querySelector("form").reset();
    })
}

export {showform};