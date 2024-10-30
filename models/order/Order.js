const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop", // Reference to the Shop model
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "in progress", "completed", "canceled"], // Order statuses
    default: "pending",
  },
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryPerson", // Reference to the DeliveryPerson model
    required: true, // Si tu veux que ce champ soit requis
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
