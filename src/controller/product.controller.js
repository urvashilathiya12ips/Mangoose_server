const Products = require("../../model/Products");
const Carts = require("../../model/Cart");
const Orders = require("../../model/Orders");
const OrdersDetails = require("../../model/Order_details");
const fs = require("fs");
const { verifyRequired, isExistingUser, fetchUser } = require("../helper/validation")
const {
  handleSuccess,
  handleForbidden,
  handleNotFound,
  handleBadRequest,
  handleEmptyBody
} = require("../../middleware/errorHandling");
const { reset_password } = require("./user.controller");

const addproduct = async (req, res) => {
  if (Object.keys(req.body).length == 0) {
    return handleEmptyBody(res);
  } else {
    let product = req.body;
    if (!req.file?.filename) {
      return handleNotFound(res, "Product Image Not found");
    }
    let errors = verifyRequired(req, ["name", "price", "stock", "category"])
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
      return handleSuccess(res, products);
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
      return handleSuccess(res, products);
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
    return handleSuccess(res, UserProduct);
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
  const name = req.query.q;
  const regex = new RegExp(`.*${name}.*`, "i");
  try {
    const results = await Products.find({ name: regex });
    return handleSuccess(res, { product: results });

  } catch (error) {
    return handleBadRequest(res);
  }
};

const createorder = async (req, res) => {
  let user_id = req.user._id
  //finding user product form cart
  let productlist = await Carts.find({ user_id }).populate({
    path: "product_id",
    options: { strictPopulate: false },
  });
  if (!productlist.length > 0) {
    return handleNotFound(res, "At least one product required in cart");
  }
  try {
    let newOrder = new Orders({
      user_id
    });
    //Creating a new order
    let placedOrder = await newOrder.save();
    const order_id = placedOrder._id
    //Adding items to order
    for (const product of productlist) {
      let product_id = product.product_id._id

      let order_items = new OrdersDetails({
        product_id,
        order_id,
        qty: product.qty
      });
      await order_items.save();
    }
    //Removing product from cart
    await Carts.deleteMany({ user_id });
    return handleSuccess(res, "Order Created", { order_id });
  } catch (error) {
    return handleBadRequest(res);
  }
}

const getorderbyid = async (req, res) => {
  let order_id = req.params.orderid
  try {
    user_id = req.user.id;
    let UserOrder = await OrdersDetails.find({ order_id }).populate({
      path: "product_id",
      options: { strictPopulate: false },
    });
    console.log(UserOrder);
    return handleSuccess(res, UserOrder);
  } catch (error) {
    return handleBadRequest(res);
  }
}

const getusersorder = async (req, res) => {
  try {
    user_id = req.user.id;
    let UserOrder = await Orders.find({ user_id }).select("-updatedAt")
    console.log(UserOrder);
    return handleSuccess(res, UserOrder);
  } catch (error) {
    return handleBadRequest(res);
  }
}

const getallProduct = async (req, res) => {
  try {
    await Products.find({})
      .then((products) => {
        return handleSuccess(res, "All product", { product: products })
      })
      .catch((error) => {
        console.log(error)
        return handleNotFound(res, "Error in fetching Product");
      });
  } catch (error) {
    return handleBadRequest(res);
  }

}

const getproductbyid = async (req, res) => {
  const productId = req.params.id;
  try {
    await Products.findById(productId)
      .then((product) => {
        if (!product) {
          return handleNotFound(res, "Product Not Found")
        }
        return handleSuccess(res, "Product found", { Product: product })
      })
  } catch (error) {
    return handleBadRequest(res, "Invalid Product Id");
  }

}


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
  createorder,
  getorderbyid,
  getusersorder,
  getallProduct,
  getproductbyid
};
