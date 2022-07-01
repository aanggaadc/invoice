const express = require("express");
const ROUTER = express.Router();
const salesController = require('../controller/salesController')

ROUTER.post('/add', salesController.addSales)
ROUTER.post('/all', salesController.getSalesList)
ROUTER.get('/single/:id', salesController.getSingleSales)
ROUTER.delete('/delete/:id', salesController.deleteSales)

module.exports = ROUTER
