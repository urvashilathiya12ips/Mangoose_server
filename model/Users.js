const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
     required: true
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  }
});

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;
