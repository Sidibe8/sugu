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
      res
        .status(201)
        .json({
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
  

//   http://localhost:5000/api/category/create


//   {
//     "message": "Category created successfully",
//     "category": {
//         "name": "chocolat",
//         "shop": "670e4f39685f55fa4eb61c3c",
//         "_id": "670e5196e4af5c120163cfbf",
//         "createdAt": "2024-10-15T11:27:18.092Z",
//         "__v": 0
//     }
// }