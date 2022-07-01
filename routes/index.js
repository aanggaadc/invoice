const express = require("express");
const ROUTER = express.Router();
const salesRoutes = require("./salesRoutes");
const invoiceRoutes = require('./invoiceRoutes')

ROUTER.use('/admin/sales', salesRoutes)
ROUTER.use('/admin/invoice', invoiceRoutes)


ROUTER.all("*", (req, res, next) => {
	res.status(404).json({
		error: 404,
		message: `Request URL ${req.path} Not Found`,
	});
});

ROUTER.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	res.status(statusCode).json({
		error: statusCode,
		message: err.message,
	});
});


module.exports = ROUTER