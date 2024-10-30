// routes/cart.js
const express = require("express");
const { addToCart, updateCart, removeFromCart, getCart, clearCart } = require("../../controllers/cart/cartController");
const authToken = require("../../middleware/authToken");

const router = express.Router();

router.post("/add", authToken, addToCart);    // Ajouter un produit au panier
router.put("/update", authToken, updateCart); // Mettre à jour la quantité d'un produit
router.delete("/remove/:productId", authToken, removeFromCart); // Supprimer un produit du panier
router.get("/", authToken, getCart);           // Obtenir les produits dans le panier
router.delete("/clear", authToken, clearCart);        // Obtenir les produits dans le panier

module.exports = router;
