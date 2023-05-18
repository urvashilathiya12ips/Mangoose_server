const Products = require("../../model/Products");
const Carts = require("../../model/Cart");
const fs = require("fs");
const {verifyRequired, isExistingUser, fetchUser } = require("../helper/validation")
const {
  handleSuccess,
  handleForbidden,
  handleNotFound,
  handleBadRequest,
  handleEmptyBody
} = require("../../middleware/errorHandling");

const addproduct = async (req, res) => {
  if (Object.keys(req.body).length == 0) {
    return handleEmptyBody(res);
  } else {
    let product = req.body;
    if (!req.file?.filename) {
     return handleNotFound(res, "Product Image Not found");
    }
    let errors = verifyRequired(req, ["name", "price","stock","category"])
    if (errors.length != 0) {
      return handleNotFound(res, errors);
    }
    try {
      product.image = req.file.filename;
      const newProduct = new Products(product);
      await newProduct.save();
      //Product.create(product)
      return handleSuccess(res, "Product Added");
    } catch (error) {
      //Removeing file if product is not inserted
      fs.unlinkSync(`public/assets/images/${req.file.filename}`);
      return handleBadRequest(res, "Something went wrong");
    }
  }
};

const getbycategory = async (req, res) => {
  const name = req.params.category;
  const regex = new RegExp(`^${name}$`, "i");
  try {
    const products = await Products.find({ category: regex });
    if (products.length === 0) {
      return handleNotFound(res, "Category Not Found");
    } else {
      return handleSuccess(res,products);
    }
  } catch (error) {
    return handleBadRequest(res);
  }
};

const getbestseller = async (req, res) => {
  try {
    const products = await Products.find({ bestSeller: true });
    if (products.length === 0) {
      return handleNotFound(res, "Category Not Found");
    } else {
      return handleSuccess(res,products);
    }
  } catch (error) {
    return handleBadRequest(res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    let isdelete = await Products.findByIdAndDelete(req.params.id);
    if (isdelete) {
      //removing image
      fs.unlinkSync(`public/assets/images/${isdelete.image}`);
      return handleSuccess(res, "Product Deleted");
    } else {
      return handleNotFound(res, "Product Not Found");
    }
  } catch (error) {
    return handleBadRequest(res, "Something went wrong");
  }
};

const addtocart = async (req, res) => {
  user_id = req.user.id;
  const { product_id } = req.body;
  // return res.send({user_id,product_id})
  if (!product_id) {
    return handleNotFound(res, "Product id is Required");
  }
  alreadyInserted = await Carts.count({ user_id, product_id });
  if (alreadyInserted != 0) {
    return handleForbidden(res, "Already inserted");
  }
  try {
    let newCart = new Carts({
      user_id,
      product_id,
      qty: 1,
    });
    await newCart.save();
    return handleSuccess(res, "Product inserted");
  } catch (error) {
    return handleBadRequest(res);
  }
};

const getUserCart = async (req, res) => {
  try {
    user_id = req.user.id;
    let UserProduct = await Carts.find({ user_id }).populate({
      path: "product_id",
      options: { strictPopulate: false },
    });
    return handleSuccess(res,UserProduct);
  } catch (error) {
    return handleBadRequest(res);
  }
};

const removeFromCart = async (req, res) => {
  // const { user_id, product_id } = req.body
  let user_id = req.user.id;
  let product_id = req.params.productid;
  if (!product_id) {
    return handleNotFound(res, "Product id is required");
  }
  try {
    const result = await Carts.deleteOne({
      user_id: user_id,
      product_id: product_id,
    });
    if (result.deletedCount === 0) {
      return handleBadRequest(res, "Invalid product id");
    }
    return handleSuccess(res, "Product removed");
  } catch (error) {
    return handleBadRequest(res);
  }
};

const updatecart = (req, res) => {
  let cart_id = req.params.cartid;
  if (Object.keys(req.body).length == 0) {
    return handleEmptyBody(res, "Empty Body");
  }
  Carts.updateOne({ _id: cart_id }, { qty: req.body.qty })
    .then((result) => {
      console.log(result);
      if (result.matchedCount > 0) {
        return handleSuccess(res, "Update");
      } else {
        return handleBadRequest(res, "Invalid Product Id");
      }
    })
    .catch((error) => {
      return handleBadRequest(res, "Something went wrong");
    });
};

const searchbyname = async (req, res) => {
  const name = req.params.name;
  const regex = new RegExp(`.*${name}.*`, "i");
  try {
    const results = await Products.find({ name: regex });
    if (results.length === 0) {
      return handleNotFound(res, "product not found");
    } else {
      return handleSuccess(res,results);
    }
  } catch (error) {
    return handleBadRequest(res);
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
};
