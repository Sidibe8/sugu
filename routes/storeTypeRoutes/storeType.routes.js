// routes/storeTypeRoutes.js
const express = require("express");
const router = express.Router();
const storeTypeController = require("../../controllers/storeTypeController/storeTypeController");
const authToken = require("../../middleware/authToken");
const adminAuth = require("../../middleware/adminAuth");

// Route pour créer un type de boutique (réservée à l'admin)
router.post("/", authToken, adminAuth, storeTypeController.createStoreType);

// Route pour lister tous les types de boutique
router.get("/", storeTypeController.getAllStoreTypes);

// Route pour supprimer un type de boutique (réservée à l'admin)
router.delete("/:storeTypeId", authToken,adminAuth,  storeTypeController.deleteStoreType);

module.exports = router;
