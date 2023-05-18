const Products = require("../../model/Products");
const Carts = require("../../model/Cart");
const fs = require("fs");
const allFieldsRequired = require("../utils/function");
const { default: mongoose } = require("mongoose");
const addproduct = async (req, res) => {
  if (Object.keys(req.body).length == 0) {
    return res.status(500).send({
      status: 500,
      message: "Empty body",
    });
  } else {
    let product = req.body;
    if (!req.file?.filename) {
      return res.status(400).send({
        status: 400,
        message: "Product Image is required",
      });
    }
    if (
      !req.body.price ||
      !req.body.name ||
      !req.body.category ||
      !req.body.stock
    ) {
      return res.status(400).send({
        status: 400,
        message: "Product Name, Price,stock,category are required",
      });
    }
    try {
      product.image = req.file.filename;
      const newProduct = new Products(product);
      await newProduct.save();
      //Product.create(product)
      return res.status(201).send({
        status: 201,
        message: "Product Added",
      });
    } catch (error) {
      //Removeing file if product is not inserted
      fs.unlinkSync(`public/assets/images/${req.file.filename}`);
      return res.status(400).send({
        status: 400,
        message: "Something went wrong",
      });
    }
  }
};

const getbycategory = async (req, res) => {
  const name = req.params.category;
  const regex = new RegExp(`^${name}$`, "i");
  try {
    const products = await Products.find({ category: regex });
    if (products.length === 0) {
      return res
        .status(404)
        .send({ status: 404, message: "Category Not Found" });
    } else {
      return res
        .status(200)
        .send({ status: 200, message: "success", data: products });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Something went wrong",
    });
  }
};

const getbestseller = async (req, res) => {
  try {
    const products = await Products.find({ bestSeller: true });
    if (products.length === 0) {
      return res
        .status(404)
        .send({ status: 404, message: "Category Not Found" });
    } else {
      return res
        .status(200)
        .send({ status: 200, message: "success", data: products });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Something went wrong",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    let isdelete = await Products.findByIdAndDelete(req.params.id);
    if (isdelete) {
      //removing image
      fs.unlinkSync(`public/assets/images/${isdelete.image}`);
      return res.status(200).send({
        status: 200,
        message: "Product deleted",
      });
    } else {
      return res.status(404).send({
        status: 404,
        message: "Record not found",
      });
    }
  } catch (e) {
    return res.status(400).send({
      status: 400,
      message: "Something went wrong",
    });
  }
};

const addtocart = async (req, res) => {
  user_id = req.user.id;
  const { product_id } = req.body;
  // return res.send({user_id,product_id})
  if (!product_id) {
    return res.status(404).send({
      status: 404,
      message: "Product Id is required",
    });
  }
  alreadyInserted = await Carts.count({ user_id, product_id });
  if (alreadyInserted != 0) {
    return res.status(403).send({
      status: 403,
      message: "Already inserted",
    });
  }
  try {
    let newCart = new Carts({
      user_id,
      product_id,
      qty: 1,
    });
    await newCart.save();
    return res.status(201).send({
      status: 201,
      message: "Product added",
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Unable to add product to cart",
    });
  }
};

const getUserCart = async (req, res) => {
  try {
    user_id = req.user.id;
    let UserProduct = await Carts.find({ user_id }).populate({
      path: "product_id",
      options: { strictPopulate: false },
    });
    return res.send({
      status: 200,
      message: "Success",
      data: UserProduct,
    });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Something went wrong",
    });
  }
};

const removeFromCart = async (req, res) => {
  // const { user_id, product_id } = req.body
  let user_id = req.user.id;
  let product_id = req.params.productid;
  if (!product_id) {
    return res.status(400).send({
      status: 400,
      message: "Product Id is required",
    });
  }
  try {
    const result = await Carts.deleteOne({
      user_id: user_id,
      product_id: product_id,
    });
    if (result.deletedCount === 0) {
      return res.status(400).send({
        status: 400,
        message: "Invalid product_id",
      });
    }
    return res.status(200).send({
      status: 200,
      message: "Product removed",
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Something went wrong",
    });
  }
};

const updatecart = (req, res) => {
  let cart_id = req.params.cartid;
  if (Object.keys(req.body).length == 0) {
    return res.status(500).send({ status: 500, message: "Empty body" });
  }
  Carts.updateOne({ _id: cart_id }, { qty: req.body.qty })
    .then((result) => {
      console.log(result);
      if (result.matchedCount > 0) {
        return res.status(201).send({
          status: 201,
          message: "updated",
        });
      } else {
        return res.status(400).send({
          status: 400,
          message: "Invalid cart id",
        });
      }
    })
    .catch((error) => {
      return res.status(400).send({
        status: 400,
        message: "Something went wrong",
      });
    });
};

const searchbyname = async (req, res) => {
  const name = req.params.name;
  const regex = new RegExp(`.*${name}.*`, "i");
  try {
    const results = await Products.find({ name: regex });
    if (results.length === 0) {
      return res
        .status(404)
        .send({ status: 404, message: "Product Not Found" });
    } else {
      return res
        .status(200)
        .send({ status: 200, message: "success", data: results });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Something went wrong",
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { ...fields } = req.body;
  try {
    if (Object.keys(req.body).length === 0) {
      console.log(Object.keys(req.body).length)
      return res.status(404).send({
        type: "error",
        message: "Empty Body",
      });
    }
    const isAllFieldRequired = allFieldsRequired(Object.values(fields));

    if (isAllFieldRequired)
      return res.status(400).json({
        type: "error",
        message: "All fields are required.",
      });

    const letest_data = { ...req.body };
    if (req.file) {
      letest_data["image"] = req.file.filename;
    }

    const response = await Products.findByIdAndUpdate(id, {
      ...letest_data,
    });

    if (response) {
      const data = await Products.findById(id);
      if (!data)
        return res.status(404).json({
          type: "error",
          message: "Product not found",
        });
      return res.status(200).json({
        type: "success",
        data,
      });
    } else
      return res.status(500).json({
        type: "error",
        message: "product not found",
      });
  } catch (error) {
    return res.status(500).json({
      type: "error",
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  addproduct,
  getbycategory,
  getbestseller,
  deleteProduct,
  addtocart,
  getUserCart,
  removeFromCart,
  updatecart,
  searchbyname,
  updateProduct,
};
