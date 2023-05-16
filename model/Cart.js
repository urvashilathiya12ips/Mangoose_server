const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartsSchema = new Schema({
    qty: {
      type: Number,
      required: true,
      default:1
    },
    product_id:{type:Schema.Types.ObjectId,ref:"Products"},
    user_id:{type:Schema.Types.ObjectId,ref:"Users"}
    
  });

const Carts = mongoose.model("Carts", CartsSchema);

module.exports = Carts;