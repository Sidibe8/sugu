// middleware/authToken.js
const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  // Récupérer le token depuis les cookies ou le header Authorization
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter les informations de l'utilisateur à la requête
    next(); // Passer à la suite
  } catch (error) {
    res.status(400).json({ message: "Token invalide." });
  }
};

module.exports = authToken;
