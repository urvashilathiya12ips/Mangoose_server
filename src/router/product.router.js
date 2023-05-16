const express = require('express')
const router = new express.Router()
const multer = require('multer')
const {
    addproduct,
    deleteProduct,
    updateProduct
} = require('../controller/product.controller')

const verifytoken = require('../../middleware/verifytoken')

//Creating a storage to store the media files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {     
        cb(null, 'public/assets/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname);
        
    }
});

const upload = multer({ storage })


////////////Product related routes/////////////
router.post('/addproduct', upload.single('image'),addproduct)
router.delete('/deleteproduct/:id',deleteProduct)
// router.patch('updateproduct/:id',updateProduct)


module.exports = router