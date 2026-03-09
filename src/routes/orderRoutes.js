const express = require("express");
const orderController = require("../controllers/orderController");
const validateOrder = require("../middleware/validateOrder");

const router = express.Router();

router.post("/orders", validateOrder, orderController.createOrder);
router.get("/orders", orderController.getAllOrders);
router.get("/orders/:orderId", orderController.getOrderById);
router.delete("/orders/:orderId", orderController.deleteOrder);

module.exports = router;