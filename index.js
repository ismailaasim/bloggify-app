const dotENV = require("dotenv");
dotENV.config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const path = require("path");
const cookieParser = require("cookie-parser");
const {checkForAuthenticationCookie} = require('./middlewares/authentication')
const Blog = require('./models/blog')

PORT = process.env.PORT || 3000;

//connection
const { connectMongo } = require("./connection");
// mongoose.connect(process.env.MONGO_URI).then(()=>console.log('DB connection established')).catch((err)=>console.log('ERROR', err))
connectMongo(process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/blogify-app")
  .then(() => console.log("DB connection established"))
  .catch((err) => console.log("ERROR", err));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(checkForAuthenticationCookie("token"))
  app.use('/user',userRoute)
  app.use('/blog',blogRoute)
  app.set("view engine", "ejs");
  app.set("views",path.resolve("./views"))
  app.use(express.static(path.resolve('./public')))
//   app.use((req, res, next) => {
//     if (req.user) {
//         console.log("User in middleware:", req.user);
//         res.locals.user = req.user;
//     }
//     next();
// });
// app.set("views", path.join(__dirname, "views"));

app.get("/", async(req, res) => {
  const allBlogs = await Blog.find({})
  return res.render("home", {
    user: req.user,
    blogs : allBlogs,
  });
});

app.listen(PORT, () => console.log(`The server started at the port ${PORT}`));
