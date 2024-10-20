// routes/shopRoutes.js
const express = require("express");
const router = express.Router();
const shopController = require("../../controllers/shop/shopController");
const upload = require("../../middleware/multerConfigShopImages");

// Obtenir toutes les boutiques d'un type spécifique
router.get("/:typeId", shopController.getShopsByType);

router.post("/create", upload, shopController.createShop);

// Route pour récupérer une boutique par ID
router.get("/:shopId", shopController.getShopById);

module.exports = router;
