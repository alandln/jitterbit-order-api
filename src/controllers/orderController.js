const orderService = require("../services/orderService");

async function createOrder(req, res, next) {
    try {
        const result = await orderService.createOrder(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);    
    }
}

async function getOrderById(req, res, next) {
    try {
        const orderId = req.params.orderId;
        const order = await orderService.getOrderById(orderId);

        if(!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        
        res.json(order);
    } catch (error) {
        next(error);
    }
}

async function getAllOrders(req, res, next) {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        next(error);
    }
}

async function deleteOrder(req, res, next) {
    try {
        const orderId = req.params.orderId;

        await orderService.deleteOrder(orderId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    deleteOrder
};