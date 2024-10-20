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
  orders: [
    {
      orderDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order", // Référence au modèle de commande
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Référence à l'utilisateur
      },
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store", // Référence à la boutique
      },
      status: {
        type: String,
        default: "pending", // Statut par défaut à "pending"
        enum: ["pending", "accepted", "in_delivery", "delivered"], // Liste des statuts possibles
      },
    }
  ],
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
