const express = require("express");
const router = new express.Router();
const multer = require("multer");
const {
  addproduct,
  addtocart,
  getbycategory,
  getbestseller,
  deleteProduct,
  getUserCart,
  removeFromCart,
  updatecart,
  searchbyname,
  createorder,
  getorderbyid,
  getusersorder
} = require("../controller/product.controller");

const verifytoken = require("../../middleware/verifytoken");

const path = require("path");
//Creating a storage to store the media files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Invalid file type");
  }
});

////////////Product related routes/////////////
router.post("/addproduct", upload.single("image"), verifytoken, addproduct);
router.get("/getbycategory/:category", getbycategory);
router.get("/getbestseller", getbestseller);
router.delete('/deleteproduct/:id', verifytoken, deleteProduct)
router.post('/addtocart', verifytoken, addtocart)
router.get('/getusercart', verifytoken, getUserCart)
router.delete('/removefromcart/:productid', verifytoken, removeFromCart)
router.put('/updatecart/:cartid', verifytoken, updatecart)
router.get("/searchproduct", searchbyname);
router.post("/createorder", verifytoken, createorder);
router.get("/getusersorder", verifytoken, getusersorder);
router.get("/getorderbyid/:orderid", verifytoken, getorderbyid);

module.exports = router;
