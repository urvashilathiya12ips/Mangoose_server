const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrdersDetailsSchema = new Schema({
    order_id: { type: mongoose.Schema.Types.ObjectID, ref: "Orders" },
    product_id: { type: mongoose.Schema.Types.ObjectID, ref: "Products" },
    qty: {type: Number, default: 1}
}, {
    timestamps: true
});

const OrdersDetails = mongoose.model("OrdersDetails", OrdersDetailsSchema);

module.exports = OrdersDetails;