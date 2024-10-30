// routes/orderRoutes.js
const express = require("express");
const {
  createOrder,
  getUserOrders,
  getShopOrders,
  getDeliveryPersonOrders,
  updateOrderStatus,
} = require("../../controllers/order/OrderController");
const verifyDeliveryPerson = require("../../middleware/authDelevery");

const router = express.Router();

// Route to create a new order
router.post("/", createOrder);

// Route to get all orders for a specific user
router.get("/user/:userId", getUserOrders);

// Route to get all orders for a specific shop
router.get("/shop/:shopId", getShopOrders);

// Route pour récupérer les commandes d'un livreur
router.get('/delivery-person/:deliveryPersonId',  getDeliveryPersonOrders);



// Route to update order status via QR code scan
router.put('/order/:orderId/status', updateOrderStatus);

module.exports = router;
