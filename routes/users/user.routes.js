// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../../controllers/users/userController");
const authToken = require("../../middleware/authToken");
const uploadProfile = require("../../middleware/uploadProfile");
const adminAuth = require("../../middleware/adminAuth");

// Inscription avec upload de profil
router.post("/register",  );

router.post('/register', uploadProfile.single("profileImage"), (req, res) => {
    console.log('Request received on /register');
    console.log('Request body:', req.body);
    // Appelle la fonction normale après avoir logué
    userController.registerUser(req, res);
  });
  

// Connexion
router.post("/login", userController.loginUser);

// Route pour récupérer tous les utilisateurs
router.get('/users',authToken,adminAuth, userController.getAllUsers);

// Route pour récupérer un utilisateur par ID
router.get('/users/:id', userController.getUserById);

// Protéger les routes avec le middleware authToken
router.put("/:userId", authToken, uploadProfile.single("profileImage"), userController.updateUser);
router.delete("/:userId", authToken, userController.deleteUser);

module.exports = router;
