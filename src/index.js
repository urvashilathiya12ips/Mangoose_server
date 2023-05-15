const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const port = process.env.PORT || 3000;


//Database connection
require('../db/connection')

//To handle CORS requests
var cors = require("cors");
app.use("*", cors());

//adding environment file
require("dotenv").config();

// Parse request data into JSON
app.use(bodyParser.json());

//seting the path to serve image files
app.use(express.static("./public/assets/images/"));

//Routes
const userRoutes = require('./router/user.router')
app.use('/api/user', userRoutes)


app.get("/", (req, res) => {
  res.send("<h2>Ecommerce site server</h2>");
});

// Server to connect
app.listen(port, async () => {
  console.log("server started on http://localhost:" + port + "/");
});
