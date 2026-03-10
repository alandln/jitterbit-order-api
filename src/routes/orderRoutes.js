const express = require("express");
const orderController = require("../controllers/orderController");
const validateOrder = require("../middleware/validateOrder");

const router = express.Router();

router.post("/order", validateOrder, orderController.createOrder);
router.get("/order", orderController.getAllOrders);
router.get("/order/:orderId", orderController.getOrderById);
router.delete("/order/:orderId", orderController.deleteOrder);

module.exports = router;