const validator = require("validator");
const bcrypt = require("bcryptjs");
const Users = require("../../model/Users");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {
  handleSuccessMsg,
  handlebadrequest,
  handlenotfound,
  handleemptybody,
} = require("../../middleware/errorHandling");

const signup = async (req, res) => {
  const errorlist = { message: [] };
  let userobj = req.body;

  //checking req has body
  if (Object.keys(userobj).length == 0) {
    handleemptybody(res, "Body Is Empty");
  }
  if (!userobj.firstName) {
    errorlist.message.push("FirstName is required");
  }
  if (!userobj.lastName) {
    errorlist.message.push("LastName is required");
  }
  if (!userobj.email) {
    errorlist.message.push("Email is required");
  } else {
    if (!validator.isEmail(userobj.email)) {
      errorlist.message.push("Invalid Email");
    }
  }
  if (!userobj.password) {
    errorlist.message.push("Password is required");
  }
  try {
    if (errorlist.message.length != 0) {
      throw ("Error", errorlist);
    }
    //Encrypting the password
    userobj.password = await bcrypt.hash(userobj.password, 7);

    //checking already existing user
    let isNewUser = await Users.count({ email: userobj.email });
    if (isNewUser == 1) {
      handlebadrequest(res, "Email Alredy Exists");
    }
    const newUser = new Users(userobj);
    newUser.save();
    handleSuccessMsg(res, "User Added", newUser);
  } catch (error) {
    if (error.errors) {
      //To catch DB error
      handlebadrequest(res, "Unable to add user");
    } else {
      handlebadrequest(res, error.message);
    }
  }
};

const signin = async (req, res) => {
  let userobj = req.body;
  try {
    if (Object.keys(userobj).length == 0) {
      handleemptybody(res, "Body Is Empty");
    }
    if (!userobj.email || !userobj.password) {
      handlebadrequest(res, "Email and password are required");
    }
    let Userinfo = await Users.findOne({ email: userobj.email });
    if (Userinfo) {
      const isMatch = await bcrypt.compare(userobj.password, Userinfo.password);
      if (isMatch) {
        //Generating token
        const token = jwt.sign({ _id: Userinfo._id }, process.env.SECRET_KEY, {
          expiresIn: "30m",
        });

        handleSuccessMsg(res, "login success", {
          token: token,
          user: Userinfo,
        });
      } else {
        //when password is not matched
        handlebadrequest(res, "Invalid Credential");
      }
    } else {
      //When user is not found
      handlenotfound(res, "User Not found");
    }
  } catch (e) {
    handlebadrequest(res, "Something went wrong");
  }
};

const profile = async (req, res) => {
  handleSuccessMsg(res, "login success", req.user);
};

const profile_update = async (req, res) => {
  const updatesObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  try {
    if (!updatesObj.firstName || !updatesObj.lastName) {
      handleemptybody(res, "FirstName and Lastname Can't be Empty");
    } else {
      Users.findByIdAndUpdate(req.params.id, updatesObj, { new: true })
        .then((updatedUser) => {
          handleSuccessMsg(res, "Update Profile successfully");
        })
        .catch((error) => {
          handlenotfound(res, "User Not Found");
        });
    }
  } catch (e) {
    handlebadrequest(res, "Something went wrong");
  }
};

module.exports = {
  signup,
  signin,
  profile,
  profile_update,
};
