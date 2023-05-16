const Products = require('../../model/Products')
const fs = require("fs");
const addproduct = async (req, res) => {
    if (Object.keys(req.body).length == 0) {
        return res.status(500).send({
            status: 500,
            message: 'Empty body'
        })
    }
    else {
        let product = req.body
        if (!req.file?.filename) {
            return res.status(400).send({
                status: 400,
                message: 'Product Image is required'
            })
        }
        if (!req.body.price || !req.body.name) {
            return res.status(400).send({
                status: 400,
                message: 'Product Name & Price are required'
            })
        }
        try {
            product.image = req.file.filename
            const newProduct = new Products(product)
            await newProduct.save()
            //Product.create(product)
            return res.status(201).send({
                status: 201,
                message: 'Product Added'
            })
        }
        catch (error) {
            //Removeing file if product is not inserted
            fs.unlinkSync(`public/assets/images/${req.file.filename}`)
            return res.status(400).send({
                status: 400,
                message: "Something went wrong"
            })
        }
    }
}

const deleteProduct = async (req, res) => {
    try {
        let isdelete = await Products.findByIdAndDelete(req.params.id)
        if (isdelete) {
            return res.send(check)
        } else {
            return res.status(500).send({
                status: 404,
                message: "record not find"
            })
        }
    }
    catch (e) {
        return res.status(201).send({
            status: 201,
            message: "Product deleted successfully"
        })
    }
}




module.exports = {
    addproduct,
    deleteProduct,

}


