const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop", // Associe la catégorie à un shop
    required: [true, "Shop is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Category", categorySchema);
