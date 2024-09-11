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
        <option value="blog">Blog</option>
        </select>

        <div class="mb-3">
        <label for="description" class"mt-4">Description</label>
        <textarea class="form-control" placeholder="Enter Blog" name="blogDescription"></textarea>
       
        </div>

        <div>
        <span id="authorr">Author Name</span><br>
        <input type="text" class="form control" name="author">
        </div>

        <div class="mb-3">
        <span id="numberr">Number</span><br>
        <input type="number" class="form control" name="number">
       
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

const blog = document.getElementById("blog");
blog.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url : "/blogdash",
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

const id = document.getElementById("id");
id.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url : "/deletee",
        success : function(data)
        {
            console.log($("#form").html(data))
        }
    })   
})

document.getElementsById("btnsubmit").addEventListener("submit,", function(event){
    event.preventDefault()
    const query = document.getElementById("searchin").value

    fetch(`/search?query=${encodedURIComponent(query)}`)
    .then(response =>{
        if(!response.ok){
            throw new Error('network timeout');
        }
        return response.text();
    })
    .then(data=>{
        document.getElementById("forms").innerHTML=data;
    })
    .catch(error =>{
        console.error('interference with fetch:',error);
        document.getElementById("form").innerHTML=`<p>error interference when searching categories</p>`
    })
})