const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  bestSeller: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
});

const Products = mongoose.model("Products", ProductsSchema);

module.exports = Products;
