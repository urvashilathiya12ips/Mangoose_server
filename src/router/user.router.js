const express = require("express");
const router = new express.Router();
const {
  signup,
  signin,
  profile,
  profile_update,
  forgot_password,reset_password
} = require("../controller/user.controller");

const verifytoken = require("../../middleware/verifytoken");

////////////User related routes/////////////
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile", verifytoken, profile);
router.patch("/profile_update", verifytoken, profile_update);
router.post("/forgot_password",forgot_password);
router.post("/reset_password",reset_password);

module.exports = router;
