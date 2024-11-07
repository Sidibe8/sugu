// controllers/categoryController.js
const Category = require("../../models/Category/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, shop } = req.body; // On récupère le nom et l'ID du shop dans la requête

    console.log(req.body, "request");

    // Vérification des champs
    if (!name || !shop) {
      return res.status(400).json({ message: "Name and shop ID are required" });
    }

    // Création de la catégorie
    const newCategory = new Category({
      name,
      shop, // Associe l'ID de la boutique à la catégorie
    });

    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

exports.getCategoriesByShop = async (req, res) => {
  const { shopId } = req.params;

  try {
    const categories = await Category.find({ shop: shopId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Find the product by ID and delete it
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
