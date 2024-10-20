// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Référence à la catégorie
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop", // Référence à la boutique
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
