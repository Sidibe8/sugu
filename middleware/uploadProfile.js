const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads/profile";

// Vérifiez si le dossier existe, sinon créez-le
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Crée le dossier et ses parents si nécessaire
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Dossier pour les images de profil
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ajoute un timestamp au nom du fichier
  },
});

const uploadProfile = multer({ storage });

module.exports = uploadProfile;
