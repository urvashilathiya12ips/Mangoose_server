const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartsSchema = new Schema({
  user_id: {type: mongoose.Schema.Types.ObjectID, ref: "Users"},
  product_id: {type: mongoose.Schema.Types.ObjectID, ref: "Products"},
  qty: {type: Number, default: 1},
});

const Carts = mongoose.model("Carts", CartsSchema);

module.exports = Carts;