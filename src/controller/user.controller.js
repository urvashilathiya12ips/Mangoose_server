const bcrypt = require("bcryptjs");
const Users = require("../../model/Users");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {verifyRequired, isExistingUser, fetchUser } = require("../helper/validation")
const {
  handleSuccess,
  handleNotFound,
  handleBadRequest,
  handleEmptyBody
} = require("../../middleware/errorHandling");

const signup = async (req, res) => {
  let userobj = req.body;
  //checking req has body
  try {
    if (Object.keys(userobj).length == 0) {
      return handleEmptyBody(res);
    }
    let errors = verifyRequired(req, ["firstName", "lastName", "email", "password"])
    if (errors.length != 0) {
      return handleNotFound(res, errors);
    }
    //Encrypting the password
    userobj.password = await bcrypt.hash(userobj.password, 7);

    //checking already existing user
    let isNewUser = isExistingUser(userobj.email);
    if (!isNewUser) {
      return handleBadRequest(res, "Email Alredy Exists");
    }
    const newUser = new Users(userobj);
    newUser.save();
    return handleSuccess(res, "User Added", newUser);
  } catch (error) {
    return handleBadRequest(res, "Unable add user");
  }
};

const signin = async (req, res) => {
  let userobj = req.body;
  try {
    if (Object.keys(userobj).length == 0) {
      return handleEmptyBody(res);
    }
    //Validations
    let errors = verifyRequired(req, ["email", "password"])
    if (errors.length != 0) {
      return handleNotFound(res, errors);
    }

    let Userinfo = await fetchUser(userobj.email)
    if (Userinfo) {
      const isMatch = await bcrypt.compare(userobj.password, Userinfo.password);
      if (isMatch) {
        //Generating token
        const token = jwt.sign({ _id: Userinfo._id }, process.env.SECRET_KEY, {
          expiresIn: "30m",
        });
        return handleSuccess(res, "login success", {
          token: token,
          user: Userinfo,
        });
      } else {
        //when password is not matched
        return handleBadRequest(res, "Invalid Credential");
      }
    } else {
      //When user is not found
      return handleNotFound(res, "User Not found");
    }
  } catch (e) {
    handleBadRequest(res, "Something went wrong");
  }
};

const profile = async (req, res) => {
  return handleSuccess(res, "login success", req.user);
};

const profile_update = async (req, res) => {
  try {
    if (Object.keys(req.body).length == 0) {
      return handleEmptyBody(res);
    } else {
      const updatesObj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };
      Users.findByIdAndUpdate(req.user._id, updatesObj, { new: true }).select("-password","-email")
        .then((updatedUser) => {
          return handleSuccess(res, "Profile updated");
        })
        .catch((error) => {
          return handleNotFound(res, "User Not Found");
        });
    }
  } catch (e) {
    return handleBadRequest(res);
  }
};

module.exports = {
  signup,
  signin,
  profile,
  profile_update,
};
