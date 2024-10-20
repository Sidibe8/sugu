// models/Shop.js
const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  ownerEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerSurname: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  closingHours: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  coverImage: {
    type: String,
    default: "",
  },
  shopType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StoreType", // Référence au modèle StoreType
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Référence aux catégories de la boutique
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
