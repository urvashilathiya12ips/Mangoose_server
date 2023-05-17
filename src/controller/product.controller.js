const Products = require("../../model/Products");
const Carts = require("../../model/Cart");
const fs = require("fs");
const {
  handleSuccessMsg,
  handlebadrequest,
  handlenotfound,
  handleforbidden,
  handleemptybody,
} = require("../../middleware/errorHandling");

const addproduct = async (req, res) => {
  if (Object.keys(req.body).length == 0) {
    handleemptybody(res, "Empty Body");
  } else {
    let product = req.body;
    if (!req.file?.filename) {
      handlebadrequest(res, "Product Image Not found");
    }
    if (
      !req.body.price ||
      !req.body.name ||
      !req.body.category ||
      !req.body.stock
    ) {
      handlebadrequest(res, "Product Name, Price,stock,category are required");
    }
    try {
      product.image = req.file.filename;
      const newProduct = new Products(product);
      await newProduct.save();
      //Product.create(product)
      handleSuccessMsg(res, "Product Added");
    } catch (error) {
      //Removeing file if product is not inserted
      fs.unlinkSync(`public/assets/images/${req.file.filename}`);
      handlebadrequest(res, "Something went wrong");
    }
  }
};

const getbycategory = async (req, res) => {
  const name = req.params.category;
  const regex = new RegExp(`^${name}$`, "i");
  try {
    const products = await Products.find({ category: regex });
    if (products.length === 0) {
      handlenotfound(res, "Category Not Found");
    } else {
      handleSuccessMsg(res, "", products);
    }
  } catch (error) {
    handlebadrequest(res, "Something went wrong");
  }
};

const getbestseller = async (req, res) => {
  try {
    const products = await Products.find({ bestSeller: true });
    if (products.length === 0) {
      handlenotfound(res, "Category Not Found");
    } else {
      handleSuccessMsg(res, "", products);
    }
  } catch (error) {
    handlebadrequest(res, "Something went wrong");
  }
};

const deleteProduct = async (req, res) => {
  try {
    let isdelete = await Products.findByIdAndDelete(req.params.id);
    if (isdelete) {
      //removing image
      fs.unlinkSync(`public/assets/images/${isdelete.image}`);
      handleSuccessMsg(res, "Product Deleted");
    } else {
      handlenotfound(res, "Record Not Found");
    }
  } catch (e) {
    handlebadrequest(res, "Something went wrong");
  }
};

const addtocart = async (req, res) => {
  user_id = req.user.id;
  const { product_id } = req.body;
  // return res.send({user_id,product_id})
  if (!product_id) {
    handlenotfound(res, "Product Id is Required");
  }
  alreadyInserted = await Carts.count({ user_id, product_id });
  if (alreadyInserted != 0) {
    handleforbidden(res, "Alredy Inserted");
  }
  try {
    let newCart = new Carts({
      user_id,
      product_id,
      qty: 1,
    });
    await newCart.save();
    handleSuccessMsg(res, "Product Added Sucessful");
  } catch (error) {
    handlebadrequest(res, "Something went wrong");
  }
};

const getUserCart = async (req, res) => {
  try {
    user_id = req.user.id;
    let UserProduct = await Carts.find({ user_id }).populate({
      path: "product_id",
      options: { strictPopulate: false },
    });
    handleSuccessMsg(res, "", UserProduct);
  } catch (error) {
    handlebadrequest(res, "Something went wrong");
  }
};

const removeFromCart = async (req, res) => {
  // const { user_id, product_id } = req.body
  let user_id = req.user.id;
  let product_id = req.params.productid;
  if (!product_id) {
    handlebadrequest(res, "Product Id is required");
  }
  try {
    const result = await Carts.deleteOne({
      user_id: user_id,
      product_id: product_id,
    });
    if (result.deletedCount === 0) {
      handlebadrequest(res, "Invalid Product Id");
    }
    handleSuccessMsg(res, "Product Remove successful");
  } catch (error) {
    handlebadrequest(res, "Something went wrong");
  }
};

const updatecart = (req, res) => {
  let cart_id = req.params.cartid;
  if (Object.keys(req.body).length == 0) {
    handleemptybody(res, "Empty Body");
  }
  Carts.updateOne({ _id: cart_id }, { qty: req.body.qty })
    .then((result) => {
      console.log(result);
      if (result.matchedCount > 0) {
        handleSuccessMsg(res, "Update");
      } else {
        handlebadrequest(res, "Invalid Product Id");
      }
    })
    .catch((error) => {
      handlebadrequest(res, "Something went wrong");
    });
};

const searchbyname = async (req, res) => {
  const name = req.params.name;
  const regex = new RegExp(`.*${name}.*`, "i");
  try {
    const results = await Products.find({ name: regex });
    if (results.length === 0) {
      handlenotfound(res, "product not found");
    } else {
      handleSuccessMsg(res, "", results);
    }
  } catch (error) {
    handlebadrequest(res, "Something went wrong");
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
