// middleware/adminAuth.js

const adminAuth = (req, res, next) => {
    // Vérifiez si l'utilisateur est authentifié (si req.user existe)
    if (!req.user) {
      return res.status(403).json({ message: "Access denied. No user found." });
    }

    console.log(req.user.role)
  
    // Vérifiez si l'utilisateur a le rôle d'admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }
  
    // Si l'utilisateur est admin, passez à la suite
    next();
  };
  
  module.exports = adminAuth;
  