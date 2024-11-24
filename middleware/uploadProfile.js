// middleware/uploadProfile.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile"); // Dossier pour les images de profil
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ajoute un timestamp au nom du fichier
  },
});

const uploadProfile = multer({ storage });

module.exports = uploadProfile;
