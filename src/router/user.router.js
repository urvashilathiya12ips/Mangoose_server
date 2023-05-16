const express = require("express");
const router = new express.Router();
const {
  signup,
  signin,
  profile,
  profile_update,
} = require("../controller/user.controller");

const verifytoken = require("../../middleware/verifytoken");

////////////User related routes/////////////
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile", verifytoken, profile);
router.patch("/profile_update/:id", verifytoken, profile_update);

module.exports = router;
