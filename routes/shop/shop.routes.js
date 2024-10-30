// routes/shopRoutes.js
const express = require("express");
const router = express.Router();
const shopController = require("../../controllers/shop/shopController");
const upload = require("../../middleware/multerConfigShopImages");
const authToken = require("../../middleware/authToken");

// Obtenir toutes les boutiques d'un type spécifique
router.get("/:typeId", shopController.getShopsByType);



router.post("/create", upload, shopController.createShop);

// Route pour le login du propriétaire de la boutique
router.post("/connexion", shopController.shopLogin);

// Route pour récupérer une boutique par ID
router.get("/home/:shopId", shopController.getShopById);

module.exports = router;
