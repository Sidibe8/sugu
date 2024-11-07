const multer = require("multer");
const path = require("path");

// Configuration du stockage pour Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products"); // Le dossier où les fichiers seront sauvegardés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.fieldname + path.extname(file.originalname));
  }
});

// Filtrage des fichiers pour accepter uniquement les images
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png)!"));
  }
};

// Limite de la taille des fichiers (5MB ici)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

// Configuration de Multer
const upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter
}).single("productImage"); // Utilisation d'un seul fichier d'image par produit

module.exports = upload;
