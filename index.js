const express = require("express");  //Express is a web framework
const server = express();
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose"); //ODM
const cors = require("cors");  //a security feature that restrict web browsers to make requests to a different domain than the one serving the web page.
const bodyParser = require("body-parser");  //to parse(analyze or break up) incoming http request in a middleware This is crucial for handling data submitted through HTML forms, JSON data, and other formats.
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");   //small piece of data stored in the clients browser, software library used to parse and extract cookie data from http request
const session = require("express-session"); //cookie-parser is a middleware module for Node.js that allows you to parse and extract cookie data from HTTP requests.
const multer = require("multer");
const path = require("path");  // built in module that provides utilities for working with file and directory(modules are encapsulated units of code that can be reused across different parts of an application)
const dotenv = require("dotenv");   //dotenv zero- dependency module that loads environment variables from a".env" file into process.env
dotenv.config();                       //helps to read env file
const User = require("./Model/User");
const Userfeed = require("./Model/Userfeed");
const CreateBlog = require("./Model/Createblog");
const bcrypt = require("bcrypt");  // cryptographic algorithm
const jwt = require("jsonwebtoken");  // securely transfer information over the web using json format,

// Middleware
server.use(cors());  //use() to define error-handling middleware by specifying four arguements(err,req,res,next)
server.use(express.static(path.join(__dirname, "public")));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json()); // ctrl+shift+i text based data exchange format
server.use(cookieParser());
server.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,   //saveUninitialized. Forces a session that is “uninitialized” to be saved to the store express, mongoose,
    })
);

// View Engine Setup
server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");
// read .env file
const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
// Database Connection
const connectDB = require("./config/dbcon");
connectDB();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dulj6ztpw',
    api_key: '689953693236487',
    api_secret: 'EGYYZCfpaOxOX6ivbcfqqVIBakw',
});

// JWT Middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {                                       //switch
        return res.render("login");
    }
    try {
        const decoded = jwt.verify(token, "secretKey");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send("Invalid token");
    }
};

// JWT validate

const validate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {                                       
        return res.render("index");
    }
    try {
        const decoded = jwt.verify(token, "secretKey");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send("Invalid token");
    }
};




// Routes
server.get("/registeruser", (req, res) => {
    res.render("register");
});

server.post("/registeruser", async (req, res) => {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill in all fields" });
    }
    
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(422).json({ error: "User already exists" });
    }else{
        const hash = await bcrypt.hash(password, 10);
    const profile = {
        name: name,
        email: email,
        isAdmin: false,
        password: hash,
        cpassword: cpassword
    };
    const feed = await User.create(profile);
    res.redirect("login") 
    }  
});

server.get("/login", (req, res) => {
    res.render("login");
});

server.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please fill in all fields" });
    }

    const savedUser = await User.findOne({ email });
    if (!savedUser) {
        return res.status(404).json({ error: "User not found" });
    }

    if (savedUser.isAdmin) {
        const match = await bcrypt.compare(password, savedUser.password);
        if (match) {
            const token = jwt.sign({ _id: savedUser._id }, "secretKey");
            res.cookie("token", token, { httpOnly: true });
            req.session.user = token;
            res.redirect("admin");
        } else {
            res.status(401).json({ error: "Incorrect password" });
        }
    } else { const token = jwt.sign({ _id: savedUser._id }, "secretKey");
    res.cookie("token", token, { httpOnly: true });
    req.session.user = token;

        res.redirect("services");
    }
});

server.get("/admin", verifyToken, (req, res) => {
    res.render("admindash/index");
});

server.get("/index", (req, res) => {
    res.render("index");
});


server.get("/blog", (req, res) => {
    res.render("blog");
});

// Image Upload
const imgPath = path.join(__dirname, 'public/img/uploaded');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, imgPath);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});
const upload = multer({ storage });

server.post("/blog", upload.single("imgupload"), async (req, res) => {
    const { title, blogCategory, blogDescription, number } = req.body;
    const blogimge = req.file.path;

    try {
        const result = await cloudinary.uploader.upload(blogimge, {
            folder: "batch5_construct",
        });
        // verify image size
        if (req.file.size > 2 * 1024 * 1024) {
            return res.status(400).json({ error: "Image too large" });
        }
        // verify image type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: "Invalid image type" });
        }
        
        const blogimg = result.secure_url;
        if (!title || !blogCategory || !blogDescription) {
            return res.status(400).json({ error: "Fill all required fields" });
        }

        const blogExists = await CreateBlog.findOne({ title });
        if (blogExists) {
            return res.status(400).json({ error: "Blog already exists" });
        }

        const newBlog = await CreateBlog.create({
            title,
            blogCategory,
            blogDescription,
            blogimg,
        });

        if (newBlog) {
            res.send("Blog Created Successfully");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


// load the users page
server.get("/users", (req, res) => {
    res.render("index")
});

server.get("/adminblog", async (req, res) => {
    const blogs = await CreateBlog.find();
    res.render("adminblog", { blog: blogs });
});

server.get("/aboutdash", async (req, res) => {
    const about = await CreateBlog.find({ blogCategory: "about" });
    res.render("aboutdash", { about });
});

server.get("/about", async (req, res) => {
    const about = await CreateBlog.find({ blogCategory: "about" });
    res.render("about", { about });
});

server.get("/projects", async (req, res) => {
    const projects = await CreateBlog.find({ blogCategory: "projects" });
    res.render("projects", { projects });
});

server.get("/projectdash", async (req, res) => {
    const projects = await CreateBlog.find({ blogCategory: "projects" });
    res.render("projectdash", { projects });
});

server.get("/services",validate, async (req, res) => {
    const services = await CreateBlog.find({ blogCategory: "services" });
    res.render("services", { services });
});

server.get("/servicedash",  async(req, res) => {
    const services = await CreateBlog.find({ blogCategory: "services" });
    res.render("servicedash", { services });
});

server.get("/customer", async (req, res) => {
    const customer = await Userfeed.find();
    res.render("customer", { customer: customer });
});

server.get("/newReg", async (req, res) => {
    const newReg = await User.find();
    res.render("newReg", { newReg: newReg });
});



server.get("/contact", (req, res) => {
    res.render("contact");
});

server.post("/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message ||!subject) {
        return res.status(422).json({ error: "Please fill in all fields" });
    }

    await Userfeed.create({ name, email, message, subject });
    res.send("Thank you for your feedback");
});

server.get("/delete", (req, res) => {
    res.render("management");
});

server.post("/delete", async (req, res) => {
    const { email } = req.body;
    await User.deleteOne({ email }).then(() => {
        res.send("User deleted successfully");
    }).catch(err => console.error(err));
});

server.get("/del", (req, res) => {
    res.render("del");
});

server.post("/del", async (req, res) => {
    const { title } = req.body;
    await User.deleteOne({ title }).then(() => {
        res.send("Blog deleted successfully");
    }).catch(err => console.error(err));
});


server.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

// Database Connection Events
const db = mongoose.connection;
db.on("error", (err) => {
    console.log("Connection error:", err);
});
db.once("open", () => {
    console.log("Connected to database");
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
db.on("close", () => {
    console.log("Connection closed");
});
     // send mail code
// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // Use `true` for port 465, `false` for all other ports
//     auth: {
//       user: "olisahifenna16@gmail.com",
//       pass: "icndvpcqcbxqoaod",
//     },
//   });

        
//   // async..await is not allowed in global scope, must use a wrapper
//   async function main(senderemail, receiveremail) {
//     // send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: `"abiodun site" ${senderemail}`, // sender address
//       to: `${receiveremail}`, // list of receivers
//       subject: "Welcome To Our Product Page", // Subject line
//       text: "Hello world?", // plain text body
//     //   html: "<b>Hello world?</b>", // html body

//     });
  
//     // console.log("Message sent: %s", info.messageId);
//     // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
//   }
// // end mail
    

