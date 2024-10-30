// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/categoryController/categoryController");

router.post("/create", categoryController.createCategory);

// Obtenir toutes les catégories d'une boutique
router.get("/shop/:shopId", categoryController.getCategoriesByShop);

router.delete('/:categoryId', categoryController.deleteCategory);


module.exports = router;
