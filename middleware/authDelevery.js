const jwt = require("jsonwebtoken");
const DeliveryPerson = require("../models/DeliveryPerson/DeliveryPerson");

const verifyDeliveryPerson = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Obtention du token

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const deliveryPerson = await DeliveryPerson.findById(decoded.id); // Vérifier le livreur avec l'ID décodé

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found." });
    }

    req.deliveryPerson = deliveryPerson; // Ajouter le livreur à la requête
    next(); // Passer à la prochaine fonction middleware
  } catch (error) {
    return res.status(500).json({ message: "Failed to authenticate token.", error });
  }
};

module.exports = verifyDeliveryPerson; // Correction ici
