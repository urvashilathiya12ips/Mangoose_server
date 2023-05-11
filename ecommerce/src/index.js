const express = require("express");
const app = express();

const mongoose = require('mongoose')

//adding environment file
require("dotenv").config();

var bodyParser = require("body-parser");
const path = require("path");
var cors = require("cors");


const port = process.env.PORT || 3000;

//To handle CORS requests
app.use("*", cors());

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//seting the path to serve image files
app.use(express.static("./public/assets/images/"));

app.get("/", (req, res) => {
  res.send("<h2>Ecommerce site server</h2>");
});
const Users = require("../model/Users")
mongoose
  .connect("mongodb+srv://hirenpitpath:hirenpitpath@e-commerce.1fsteva.mongodb.net/e-commerce?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("🟢 Database connection established");
  })
  .catch((error) =>
    console.error(`🔴 Database connection failed, ${error.message}`)
  );

app.listen(port, async () => {
  console.log("server started on http://localhost:" + port + "/");
  const User = new Users({"userName":"Urvashi","email":"test1","password":"pppp"})
  User.save()
    let data= await Users.find({}) 
    console.log(data)
  
});
