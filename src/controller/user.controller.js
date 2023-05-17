const Users = require("../../model/Users");
const serverError = require("../utils/error");
const allFieldsRequired = require("../utils/function");
const { hashPassword, generateNewToken, comparePassword } = require("../utils/helper");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const isAllFieldRequired = allFieldsRequired([firstName, lastName, email, password])
    if (isAllFieldRequired) return res.status(400).json({
      type: "error",
      message: "All fields are required."
    })

    const existUser = await Users.findOne({ email })
    if (!!existUser) return res.status(400).json({
      type: "error",
      message: "email already exist."
    })

    const data = new Users({
      firstName, lastName, email, password: await hashPassword(password)
    })

    const userData = await data.save()

    res.status(201).json({
      type: "success",
      message: "User register successfully.",
      token: await generateNewToken({
        user_id: userData?._id,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        email: userData?.email,
        password: userData?.password
      })
    })
  } catch (error) {
    serverError(error, res)
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body
    
    const isAllFieldRequired = allFieldsRequired([email, password])
    if (isAllFieldRequired) return res.status(400).json({
      type: "error",
      message: "All fields are required."
    })
    
    const findUser = await Users.findOne({ email })
    if (!findUser) return res.status(400).json({
      type: "error",
      message: "user not found this email address."
    })
    
    const isAuthenticated = await comparePassword(password, findUser?.password)
    if (!isAuthenticated) return res.status(401).json({
      type: "error",
      message: "Invalid username or password."
    })

    return res.status(200).json({
      type: "success",
      message: "User login successfully",
      token: await generateNewToken({
        user_id: findUser?._id,
        firstName: findUser?.firstName,
        lastName: findUser?.lastName,
        email: findUser?.email,
        password: findUser?.password
      })
    })

  } catch (error) {
    serverError(error, res)
  }
};

const profile = async (req, res) => {
  return res
    .status(200)
    .send({ status: 200, message: "User Authenticated", data: req.user });
};

const profile_update = async (req, res) => {
  const updatesObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  try {
    if (!updatesObj.firstName || !updatesObj.lastName) {
      return res.status(500).send({
        status: 500,
        message: "FirstName and Lastname Can't be Empty",
      });
    } else {
      Users.findByIdAndUpdate(req.params.id, updatesObj, { new: true })
        .then((updatedUser) => {
          return res
            .status(200)
            .send({ status: 200, message: "Update Profile successfully" });
        })
        .catch((error) => {
          return res
            .status(404)
            .send({ status: 404, message: "User Not Found" });
        });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ status: 400, message: "Something went wrong" });
  }
};

module.exports = {
  signup,
  signin,
  profile,
  profile_update,
};
