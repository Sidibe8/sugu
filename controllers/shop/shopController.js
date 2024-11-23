// controllers/shopController.js
const Shop = require("../../models/shop/Shop");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pushFilesToGitHub, pushFileToGitHub } = require("../../utils/gitHandler"); // Importer la fonction pushFilesToGitHub


// Créer une nouvelle boutique
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

    // Création d'une nouvelle boutique
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

    // Sauvegarde de la boutique dans la base de données
    const savedShop = await newShop.save();

    // Préparer les fichiers à pousser sur GitHub
    const filesToPush = [];
    if (req.files?.profileImage) {
      filesToPush.push(req.files.profileImage[0].path); // Ajouter le chemin de l'image de profil
    }
    if (req.files?.coverImage) {
      filesToPush.push(req.files.coverImage[0].path); // Ajouter le chemin de l'image de couverture
    }

    // Pousser les fichiers sur GitHub
    if (filesToPush.length > 0) {
      try {
        await pushFilesToGitHub(filesToPush); // Utiliser la fonction pour pousser plusieurs fichiers
        console.log("Files pushed to GitHub successfully");
      } catch (error) {
        console.error("Failed to push files to GitHub", error);
        return res.status(500).json({ 
          message: "Shop saved, but GitHub push failed", 
          error 
        });
      }
    }

    // Répondre au client après la création réussie
    res.status(201).json({
      message: "Shop created successfully. An activation email has been sent.",
      shop: savedShop,
    });
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ message: "Error creating shop", error });
  }
};


// Connexion d'un propriétaire de boutique
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

// Obtenir les boutiques par type
exports.getShopsByType = async (req, res) => {
  const { typeId } = req.params;

  try {
    const shops = await Shop.find({ shopType: typeId }).populate("shopType"); // Utilisation de populate pour inclure le type
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shops", error });
  }
};

// Récupérer une boutique par ID avec ses produits
exports.getShopById = async (req, res) => {
  const { shopId } = req.params;

  try {
    // Récupérer la boutique par ID
    const shop = await Shop.findById(shopId).populate("products"); // Ajout d'un populate si nécessaire

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop", error });
  }
};

// Obtenir toutes les boutiques
exports.getShops = async (req, res) => {
  try {
    // Récupérer toutes les boutiques
    const shops = await Shop.find(); // Ajout d'un populate si nécessaire

    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "Shops not found" });
    }

    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shops", error });
  }
};
