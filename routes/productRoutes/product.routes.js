// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController/productController");
const upload = require("../../middleware/multerConfigProductImages");

router.post("/create", upload, productController.createProduct);

// Obtenir tous les produits d'une catégorie
router.get("/:categoryId", productController.getProductsByCategory);
// Route pour obtenir les produits d'une boutique par ID
router.get("/shop/:shopId", productController.getProductsByShop);

// Route to delete a product
router.delete("/:productId", productController.deleteProduct);

module.exports = router;
