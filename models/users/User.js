// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true, // Assurez-vous que le produit est requis
      },
      quantity: {
        type: Number,
        default: 1,
        required: true, // Assurez-vous que la quantité est requise
      },
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  loyaltyPoints: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "client",
    enum: ["client", "admin"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
