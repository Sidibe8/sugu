// controllers/productController.js
const Product = require("../../models/Product/Product");
const { pushFileToGitHub } = require("../../utils/gitHandler");


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;
    const productImage = req.file ? req.file.path : ""; // Chemin du fichier téléchargé par Multer

    // Créez le produit dans la base de données
    const newProduct = new Product({
      name,
      description,
      price,
      categoryId,
      productImage,
    });

    await newProduct.save();

    // Si une image a été téléchargée, poussez-la vers GitHub
    if (req.file) {
      try {
        // Poussez l'image du produit vers GitHub (le chemin de fichier est fourni par Multer)
        await pushFileToGitHub(req.file.path);
        console.log("Product image pushed to GitHub successfully.");
      } catch (error) {
        console.error("Failed to push product image to GitHub", error);
      }
    }

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
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
