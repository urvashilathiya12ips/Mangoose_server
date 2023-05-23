const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrdersSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectID, ref: "Users" },
}, {
    timestamps: true
});

const Orders = mongoose.model("Orders", OrdersSchema);

module.exports = Orders;