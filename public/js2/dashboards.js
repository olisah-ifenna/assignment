const form = document.getElementById("form");
const create = document.getElementById("create");
create.addEventListener("click", (e)=>{
    e.preventDefault(),
    form.innerHTML = `<form method = "post" id="createBlog" enctype="multipart/form-data" action="/blog">
    <div class "mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" class="form-control" id="title" placeholder="Enter blog Title" name="title">
        <span id="titleErr"></span>
    </div>
    <div class"mb-3">
        <input type="file" name="imgupload">
    </div>
    <select class="form-select" aria-label="Default select example" name="blogCategory">
        <option>Choose Blog Category</option>
        <option value="about">About</option>
        <option value="services">Services</option>
        <option value="projects">Projects</option>
        </select>

        <div class="mb-3">
        <label for="description" class"mt-4">Description</label>
        <textarea class="form-control" placeholder="Enter Blog" name="blogDescription"></textarea>
       
        </div>

        <div>
        <span id="authorr">Author Name</span>
        
        </div>

        <div class="mb-3">
        <label for="author number" class="form-label">Price</label>
        <input type="number" class="form control" placeholder="Enter Price" name="number">
       
        </div>
        <input type="submit" class="btn btn-primary"></input>
        
    </form> 
    `
})


const adblog = document.getElementById("view");
view.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url : "/adminblog",
        success : function(data)
        {
            console.log($("#form").html(data))
        }
    })   
})


const about = document.getElementById("about");
about.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url : "/aboutdash",
        success : function(data)
        {
            console.log($("#form").html(data))
        }
    })   
})
const projects = document.getElementById("projects");
projects.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url : "/projectdash",
        success : function(data)
        {
            console.log($("#form").html(data))
        }
    })   
})

const services = document.getElementById("services");
services.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url : "/servicedash",
        success : function(data)
        {
            console.log($("#form").html(data))
        }
    })   
})

const customer = document.getElementById("customer");
customer.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url : "/customer",
        success : function(data)
        {
            console.log($("#form").html(data))
        }
    })   
})

const newReg = document.getElementById("newReg");
newReg.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url : "/newReg",
        success : function(data)
        {
            console.log($("#form").html(data))
        }
    })   
})


const management = document.getElementById("management");
management.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url : "/delete",
        success : function(data)
        {
            console.log($("#form").html(data))
        }
    })   
})

const title = document.getElementById("title");
title.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url : "/del",
        success : function(data)
        {
            console.log($("#form").html(data))
        }
    })   
})

document.getElementsById("formSearch").addEventListener("submit,", function(event){
    event.preventDefault()
    const search = document.getElementById("searching");

})