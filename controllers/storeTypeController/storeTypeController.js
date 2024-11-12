// controllers/storeTypeController.js
const StoreType = require("../../models/StoreType/StoreType");

// Créer un nouveau type de boutique
exports.createStoreType = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Vérifier si le type de boutique existe déjà
    const existingType = await StoreType.findOne({ name });
    if (existingType) {
      return res.status(400).json({ message: "Store type already exists" });
    }

    const storeType = new StoreType({ name, description });
    await storeType.save();

    res
      .status(201)
      .json({ message: "Store type created successfully", storeType });
  } catch (error) {
    res.status(500).json({ message: "Error creating store type", error });
  }
};

// Lister tous les types de boutique getAllStoreTypes // StoreType
exports.getAllStoreTypes = async (req, res) => {
  try {


    const storeTypes = await StoreType.find();
    res.json(storeTypes);
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching store types", error });
  }
};



// Supprimer un type de boutique
exports.deleteStoreType = async (req, res) => {
  try {
    const { storeTypeId } = req.params;
    await StoreType.findByIdAndDelete(storeTypeId);
    res.json({ message: "Store type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting store type", error });
  }
};

exports.getAllShopTypes = async (req, res) => {
  try {
    const shopTypes = await StoreType.find();
    res.status(200).json(shopTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop types", error });
  }
};

exports.getShopsByType = async (req, res) => {
  const { typeId } = req.params;

  try {
    const shops = await Shop.find({ type: typeId }); // Remplace `type` par le champ réel
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shops", error });
  }
};

// http://localhost:5000/api/store-type/

// {
//     "message": "Store type created successfully",
//     "storeType": {
//         "name": "lato Milk",
//         "description": "pour tout vos lait",
//         "_id": "670e498a872e8f67df987bfb",
//         "__v": 0
//     }
// }
