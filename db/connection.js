const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://hirenpitpath:hirenpitpath@e-commerce.1fsteva.mongodb.net/e-commerce?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database connection success");
}).catch((error) =>
  console.error(`Database connection failed, ${error.message}`)
);