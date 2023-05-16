const express = require("express");
const router = new express.Router();
const multer = require("multer");
const {
  addproduct,
  addtocart,
  getbycategory,
  getbestseller,
  deleteProduct,
  getUserCart
} = require("../controller/product.controller");

const verifytoken = require("../../middleware/verifytoken");

//Creating a storage to store the media files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

////////////Product related routes/////////////
router.post("/addproduct", upload.single("image"), verifytoken,addproduct);
router.get("/getbycategory/:category", getbycategory);
router.get("/getbestseller", getbestseller);
router.delete('/deleteproduct/:id',verifytoken,deleteProduct)
router.post('/addtocart',verifytoken,addtocart)
router.get('/getusercart',verifytoken,getUserCart)


module.exports = router;
