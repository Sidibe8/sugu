// routes/deliveryRoutes.js
const express = require("express");
const router = express.Router();
const deliveryController = require("../../controllers/deliveryController/deliveryController");
const uploadDeliveryProfile = require("../../middleware/uploadDeliveryProfile");
const authToken = require("../../middleware/authToken");

// Inscription avec upload de profil
router.post("/register", uploadDeliveryProfile.single("profileImage"), deliveryController.registerDeliveryPerson);

// Connexion
router.post("/login", deliveryController.loginDeliveryPerson);

// Mise à jour du profil (protection avec authToken)
router.put("/:deliveryPersonId", authToken, uploadDeliveryProfile.single("profileImage"), deliveryController.updateDeliveryPerson);

module.exports = router;
