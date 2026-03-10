const pool = require("../config/database");
const AppError = require("../errors/AppError");

async function createOrder(orderData) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const orderId = orderData.numeroPedido;
        const value = orderData.valorTotal;
        const creationDate = new Date(orderData.dataCriacao);

        await connection.query(
            "INSERT INTO `Order` (orderId, value, creationDate) VALUES (?, ?, ?)",
            [orderId, value, creationDate]
        );

        for (const item of orderData.items) {
            const productId = Number(item.idItem);
            const quantity = item.quantidadeItem;
            const price = item.valorItem;

            await connection.query(
                "INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)",
                [orderId, productId, quantity, price]
            );
        }

        await connection.commit();

        return {
            message: "Order created successfully"
        };
    } catch (error) {
        await connection.rollback();

        if (error.code === "ER_DUP_ENTRY") {
            throw new AppError("Order already exists", 409);
        }

        throw error;
    } finally {
        connection.release();
    }
}

async function getOrderById(orderId) {
    const [orders] = await pool.query(
        "SELECT * FROM `Order` WHERE orderId = ?",
        [orderId]
    );

    if (orders.length === 0) {
        return null;
    }

    const [items] = await pool.query(
        "SELECT productId, quantity, price FROM Items WHERE orderId = ?",
        [orderId]
    );

    return {
        orderId: orders[0].orderId,
        value: Number(orders[0].value),
        creationDate: orders[0].creationDate,
        items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: Number(item.price)
        }))
    };
}

async function getAllOrders() {
    const [orders] = await pool.query(
        "SELECT * FROM `Order` ORDER BY creationDate DESC"
    );

    const result = [];

    for (const order of orders) {
        const [items] = await pool.query(
            "SELECT productId, quantity, price FROM Items WHERE orderId = ?",
            [order.orderId]
        );

        result.push({
            orderId: order.orderId,
            value: Number(order.value),
            creationDate: order.creationDate,
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: Number(item.price)
            }))
        });
    }

    return result;
}

async function deleteOrder(orderId) {
    const [result] = await pool.query(
        "DELETE FROM `Order` WHERE orderId = ?",
        [orderId]
    );

    if (result.affectedRows === 0) {
        throw new AppError("Order not found", 404); 
    }
}

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    deleteOrder
};