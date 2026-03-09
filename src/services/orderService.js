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
            "INSERT INTO orders (order_id, value, creation_date) VALUES (?, ?, ?)",
            [orderId, value, creationDate]
        );

        for (const item of orderData.items) {
            const productId = Number(item.idItem);
            const quantity = item.quantidadeItem;
            const price = item.valorItem;

            await connection.query(
                "INSERT INTO items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
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
        "SELECT * FROM orders WHERE order_id = ?",
        [orderId]
    );

    if (orders.length === 0) {
        return null;
    }

    const [items] = await pool.query(
        "SELECT product_id, quantity, price FROM items WHERE order_id = ?",
        [orderId]
    );

    return {
        orderId: orders[0].order_id,
        value: Number(orders[0].value),
        creationDate: orders[0].creation_date,
        items: items.map(item => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: Number(item.price)
        }))
    };
}

async function getAllOrders() {
    const [orders] = await pool.query(
        "SELECT * FROM orders ORDER BY creation_date DESC"
    );

    const result = [];

    for (const order of orders) {
        const[items] = await pool.query(
            "SELECT product_id, quantity, price FROM items WHERE order_id = ?",
            [order.order_id]
        );

        result.push({
            orderId: order.order_id,
            value: Number(order.value),
            creationDate: order.creation_date,
            items: items.map(item => ({
                productId: item.product_id,
                quantity: item.quantity,
                price: Number(item.price)
            }))
        });
    }

    return result;
}

async function deleteOrder(orderId) {
    const[result] = await pool.query(
        "DELETE FROM orders WHERE order_id = ?",
        [orderId]
    );

    if(result.affectedRows === 0) {
        throw new AppError("Order not found", 404); 
    }
}

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    deleteOrder
};