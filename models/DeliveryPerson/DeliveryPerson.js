// models/DeliveryPerson.js
const mongoose = require("mongoose");

const deliveryPersonSchema = new mongoose.Schema({
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
  isAvailable: { // Champ ajouté pour indiquer la disponibilité
    type: Boolean,
    default: true, // Par défaut, le livreur est disponible
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "delivery",
    enum: ['delivery'],
  }
});

const DeliveryPerson = mongoose.model("DeliveryPerson", deliveryPersonSchema);
module.exports = DeliveryPerson;
