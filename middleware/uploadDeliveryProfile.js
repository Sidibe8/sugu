// middleware/uploadDeliveryProfile.js
const multer = require("multer");
const path = require("path");

// Configuration de Multer pour les images de profil des livreurs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/delivery_profiles"); // Dossier de stockage pour les images de profil des livreurs
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadDeliveryProfile = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille de fichier à 5 MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png)"));
    }
  },
});

module.exports = uploadDeliveryProfile;
