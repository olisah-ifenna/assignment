const form = document.getElementById("form");
const elements = document.getElementById("elements");
services.addEventListener("click", (e)=>{
    e.preventDefault(),
    form.innerHTML = `<p>We render quality services here at cyclobold facility</p>`
})