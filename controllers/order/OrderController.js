const Order = require("../../models/order/Order");
const Shop = require("../../models/shop/Shop");
const User = require("../../models/users/User");
const DeliveryPerson = require("../../models/DeliveryPerson/DeliveryPerson");

exports.createOrder = async (req, res) => {
    const { userId, cart } = req.body;
  
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
  
    const orders = {};
  
    cart.forEach((item) => {
      const { product, quantity, shopId } = item;
      if (!orders[shopId]) {
        orders[shopId] = [];
      }
      orders[shopId].push({ product, quantity });
    });
  
    try {
      for (const [shopId, products] of Object.entries(orders)) {
        const shop = await Shop.findById(shopId);
        if (!shop) {
          return res.status(404).json({ message: `Shop not found for ID: ${shopId}` });
        }
  
        // Find an available delivery person
        // const deliveryPerson = await DeliveryPerson.findOneAndUpdate(
        //   { isAvailable: true },
        //   { isAvailable: false },
        //   { new: true }
        // );
  
        // if (!deliveryPerson) {
        //   return res.status(404).json({ message: "No available delivery person found." });
        // }
  
        const order = await Order.create({
          user: userId,
          shop: shopId,
          products,
          // deliveryPerson: deliveryPerson._id,
          status: "pending",
        });
  
        user.orders.push(order._id);
        await user.save();
      }
  
      return res.status(201).json({ message: "Orders created and assigned successfully." });
    } catch (error) {
      return res.status(500).json({ message: "Failed to create orders.", error });
    }
  };

exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId })
      .populate("shop")
      .populate("products.product");
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve orders.", error });
  }
};

exports.getShopOrders = async (req, res) => {
  const { shopId } = req.params;

  try {
    const orders = await Order.find({ shop: shopId })
      .populate("user")
      .populate("products.product");
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve orders.", error });
  }
};

// Assurez-vous que le middleware d'authentification vérifie et ajoute l'ID du livreur à req.deliveryPerson

exports.getDeliveryPersonOrders = async (req, res) => {
    const { deliveryPersonId } = req.params;

    console.log("Delivery Person ID:", deliveryPersonId); // Log de l'ID du livreur

    try {
        const orders = await Order.find({ deliveryPerson: deliveryPersonId })
            .populate("user")
            .populate("shop")
            .populate("products.product");

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this delivery person." });
        }

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve orders.", error });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
  
    try {
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Update the status to "in progress" if the QR code is verified
      order.status = status || "in progress";
      await order.save();
  
      res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };