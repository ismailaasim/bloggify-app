//this one method
// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
    
// })
//this is widely used method
const {Schema, model} = require('mongoose');

const { createHmac, randomBytes } = require('crypto');
const { error } = require('console');
const { createTokenForUser } = require('../service/authentication');

const userSchema = new Schema({
    fullName : {
        type:String,
        required : true,
    },
    email : {
        type:String,
        required : true,
        unique : true,
        match : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        
    },
    salt : {
        type:String,
    },
    password : { 
        type:String,
        required : true,
    },
    profileImageURL : {
        type:String,
        default : "/images/default.jpg",
    },
    role : {
        type : String,
        enum : ["ADMIN","USER"],
        default : "USER",
    }

}, {timestamps:true});

//Pre-Save Hook
//This hook is executed before saving a user to the database.
//signup
userSchema.pre('save',function(next){
    const user = this
 //use salt with crypto hmac
 //https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options   :=> use this link we get the Hmac how to use
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex")

    this.salt = salt;
    this.password = hashedPassword;

    next();

})

//login
//this is the mongo virtuals we can create the own function using static method:
//here for login code it checks the provide password hash or not if the providede 
//password match with the hasshed password it allows to go home page other it throw an error

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user = await this.findOne({email}); 
    if(!user) throw Error('User not found!')

    const salt = user.salt;
    const hashedPassword = user.password;

    const userPasswordHash = createHmac('sha256',salt).update(password).digest("hex")

    if(hashedPassword !== userPasswordHash) throw Error('Incorrect Password!')

    // return {...user,password: undefined, salt: undefined};
    const token = createTokenForUser(user);
    return token;
})

const User = model("user", userSchema);

module.exports = User;