const express = require("express");
const ROUTER = express.Router();
const invoiceController = require('../controller/invoiceController')

ROUTER.post('/all', invoiceController.getInvoiceList)
ROUTER.get('/single/:id', invoiceController.getSingleInvoice)
ROUTER.get('/pdf/:id', invoiceController.createPDF)

module.exports = ROUTER
