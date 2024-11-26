const express = require('express');
const router = express.Router();
const User = require('../models/user')
router.get("/signup",(req,res)=>{
    return res.render("signup")
})



router.post("/signup",async(req,res)=>{
    const {fullName,email,password} = req.body;
    const errors = {}

    if(!fullName) errors.nameErr = "Full Name is required!";
    if(!email){
         errors.emailErr = "Email is required!";
    }
    else if(!/\S+@\S+\.\S+/.test(email)){
        errors.emailErr = "Invalid Email format!";
    }
    if(!password){
        errors.passwordErr = "Password is required!";
    }
    else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password)) {
            errors.passwordErr = "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
    };

    if(Object.keys(errors).length > 0){
        return res.render("signup", { errors, fullName, email,password });
    }
    try {
        await User.create({
            fullName,
            email,
            password,
         });
         return res.redirect('/');
    } catch (error) {
        console.error(error);
        // Handle errors, such as duplicate emails or database issues
        return res.render("signup", {
            errors: { generalErr: "Something went wrong. Please try again!" },
            fullName,
            email,
            password,
        });
    }
        
    
})

router.get("/login",(req,res)=>{
    return res.render("login")
})

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const errors = {}

    
    if(!email){
         errors.emailErr = "Email is required!";
    }
    if (!password) errors.passwordErr = "Password is required.";

    else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password)) {
            errors.passwordErr = "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
    };
    if(Object.keys(errors).length > 0){
        return res.render("login", { errors, email,password });
    }
    try {
        const token = await User.matchPasswordAndGenerateToken(email,password);
        // console.log("token", token);
        return res.cookie("token",token).redirect('/')
    } catch (error) {
        console.error(error); 
        return res.render("login",{
            error: {generalErr : 'OOPS Wrong Credentials!'},email,password
        });
    }
    
})

router.get('/logout', (req,res)=>{
     res.clearCookie('token').redirect('/')
})

module.exports = router;        