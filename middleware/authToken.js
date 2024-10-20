// middleware/authToken.js
const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  const token = req.cookies.token; 
  
  // console.log(token, 'token');
  

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifier le token
    req.user = decoded; // Ajouter les informations de l'utilisateur à la requête
    next(); // Passer à la suite
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authToken;
