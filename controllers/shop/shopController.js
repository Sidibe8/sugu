// controllers/shopController.js
const Shop = require("../../models/shop/Shop");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


exports.createShop = async (req, res) => {
  try {
    const {
      name,
      description,
      ownerEmail,
      phone,
      password,
      ownerName,
      ownerSurname,
      location,
      openingHours,
      closingHours,
      shopType,
    } = req.body;

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newShop = new Shop({
      name,
      description,
      ownerEmail,
      phone,
      password: hashedPassword,
      ownerName,
      ownerSurname,
      location,
      openingHours,
      closingHours,
      profileImage: req.files?.profileImage?.[0]?.path || "", // Chemin vers l'image de profil
      coverImage: req.files?.coverImage?.[0]?.path || "", // Chemin vers l'image de couverture
      shopType,
    });

    await newShop.save();
    res
      .status(201)
      .json({ message: "Shop created successfully", shop: newShop });
  } catch (error) {
    res.status(500).json({ message: "Error creating shop", error });
  }
};

exports.shopLogin = async (req, res) => {
  const { ownerEmail, password } = req.body;

  try {
    // Rechercher la boutique par l'email du propriétaire
    const shop = await Shop.findOne({ ownerEmail }).lean();

    // Vérifier si la boutique existe
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Vérifier si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, shop.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: shop._id, role: shop.role }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    // Supprimer le mot de passe de l'objet avant de le renvoyer
    delete shop.password;

    // Envoyer la réponse avec les informations de la boutique (sans le mot de passe) et le token
    res.status(200).json({ message: "Login successful", token, shop });
  } catch (error) {
    // Ajout d'informations supplémentaires en cas d'erreurs
    res.status(500).json({
      message: "Error during login",
      error: error.message || error,
    });
  }
};


exports.getShopsByType = async (req, res) => {
    const { typeId } = req.params;
  
    try {
      const shops = await Shop.find({ shopType: typeId }).populate("shopType"); // Utilisation de populate pour inclure le type
      res.status(200).json(shops);
    } catch (error) {
      res.status(500).json({ message: "Error fetching shops", error });
    }
};

// Fonction pour récupérer une boutique par ID avec ses produits
exports.getShopById = async (req, res) => {
  const { shopId } = req.params;

  console.log(shopId, 'getShopById');
  
  try {
    
    // Récupérer la boutique par ID et peupler les produits associés
    const shop = await Shop.findById(shopId) // Utilisez 'products' si vous avez une référence vers les produits dans le modèle de boutique

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop", error });
  }
};