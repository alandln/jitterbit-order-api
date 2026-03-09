const AppError = require("../errors/AppError");

function validateOrder(req, res, next) {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido) {
        return next(new AppError("Order number (numeroPedido) is required", 400));
    }

    if (valorTotal === undefined || valorTotal === null) {
        return next(new AppError("Order total value (valorTotal) is required", 400));
    }

    if (!dataCriacao) {
        return next(new AppError("Creation date (dataCriacao) is required", 400));
    }

    if (!Array.isArray(items) || items.length === 0) {
        return next(new AppError("Order must contain at least one item", 400));
    }

    next();
}

module.exports = validateOrder;