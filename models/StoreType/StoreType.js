// models/StoreType.js
const mongoose = require("mongoose");

const storeTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  }
});

const StoreType = mongoose.model("StoreType", storeTypeSchema);
module.exports = StoreType;
