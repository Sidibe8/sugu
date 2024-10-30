// controllers/cartController.js
const User = require("../../models/users/User");
const Product = require("../../models/Product/Product");

exports.addToCart = async (req, res) => {
  const { productId, quantity, location } = req.body;
  const { latitude, longitude } = location || {};

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId).populate('shop');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingItem = user.cart.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    console.log('User location:', latitude, longitude); // Use the location if needed

    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding product to cart", error: error.message });
  }
};

exports.updateCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    const existingItem = user.cart.find(item => item.product.toString() === productId);

    if (!existingItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    existingItem.quantity = quantity; // Mettre à jour la quantité
    await user.save();
    res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params; // ID du produit, pas du cart item

  console.log('Product ID from request:', productId);
  
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Comparer avec item.product.toString()
    const itemIndex = user.cart.findIndex(item => item._id.toString() === productId);

    console.log('Index of product:', itemIndex);
    console.log('User cart before modification:', user.cart);

    if (itemIndex !== -1) {
      if (user.cart[itemIndex].quantity > 1) {
        user.cart[itemIndex].quantity -= 1;
      } else {
        user.cart.splice(itemIndex, 1);
      }

      await user.save();
      console.log('User cart after modification:', user.cart);

      return res.status(200).json({ message: "Product quantity decreased or removed from cart", cart: user.cart });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error removing product from cart", error });
  }
};


exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("cart.product"); // Populate pour obtenir les détails du produit
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = []; // Vider le panier
    await user.save();
    
    res.status(200).json({ message: "Cart cleared", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};