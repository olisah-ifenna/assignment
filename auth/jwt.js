const { createSecretKey } = require("crypto");
const jwt = require("jsonwebtoken");
jwt.sign(profile, secretKey, (error, token)=>{
    if(error){
        resizeBy.send("validation issues")
    }else{
        request.session.secretKey = secretKey
        request.session.token = token
        res.cookie("usertoken", token)
        if(res.cookie("usertoken")){
            res.redirect("dash")
        }else{
            res.render("login")
        }
    }
})
module.exports = jjsonweb