// controllers/productController.js
const Product = require("../../models/Product/Product");
const { pushFileToGitHub } = require("../../utils/gitHandler");




// Créer un produit
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, shopId } = req.body;

    // Vérification des champs requis
    if (!name || !description || !price || !categoryId || !shopId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Création d'une instance de produit avec les données reçues
    const newProduct = new Product({
      name,
      description,
      price,
      category: categoryId, // ID de la catégorie associée
      shop: shopId, // ID de la boutique associée
      image: req.file ? req.file.path : "", // Ajoute le chemin de l'image si elle est présente
    });

    // Sauvegarde du produit dans la base de données
    const savedProduct = await newProduct.save();

    // Si une image a été uploadée, pousse-la vers GitHub
    if (req.file) {
      const filePath = req.file.path; // Chemin du fichier uploadé
      try {
        await pushFileToGitHub(filePath); // Pousse le fichier image vers GitHub
        console.log("Image pushed to GitHub successfully");
      } catch (error) {
        console.error("Failed to push image to GitHub", error);
        return res.status(500).json({
          message: "Product saved, but GitHub push failed",
          product: savedProduct,
          error,
        });
      }
    }

    // Réponse en cas de succès
    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category: categoryId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Fonction pour obtenir tous les produits d'une boutique par ID
exports.getProductsByShop = async (req, res) => {
  const { shopId } = req.params;

  try {
    // Récupérer tous les produits d'une boutique avec les détails de la boutique
    const products = await Product.find({ shop: shopId })
      .populate("category") // Peupler la catégorie si nécessaire
      .populate("shop"); // Peupler la boutique

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category: categoryId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Fonction pour obtenir tous les produits d'une boutique par ID
exports.getProductsByShop = async (req, res) => {
  const { shopId } = req.params;

  try {
    // Récupérer tous les produits d'une boutique avec les détails de la boutique
    const products = await Product.find({ shop: shopId })
      .populate("category") // Peupler la catégorie si nécessaire
      .populate("shop"); // Peupler la boutique

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Function to delete a product by ID
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
