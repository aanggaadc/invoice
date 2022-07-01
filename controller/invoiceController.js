const Invoice = require('../models').invoice
const errorHandler = require('../utils/errorHandler')
const { getPagination, getPagingData } = require("../utils/pagination")


async function getInvoiceList(req, res, next) {
    try {
        const {pageNumber, pageSize} = req.body
        const {limit, offset} = getPagination(pageNumber, pageSize)
        
        const listInvoice = await Invoice.findAndCountAll({
            limit: limit,
			offset: offset,
            include: "sales",
			order: [["created_at", "DESC"]],
        })

		const responseData = getPagingData(listInvoice, pageNumber, limit);

        res.status(200).json({
            message: "SUCCESS",
            data: responseData
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function getSingleInvoice(req, res, next) {
    const id = req.params.id
    try {
        const getInvoice = await Invoice.findByPk(id, {include: "sales"})

        if(!getInvoice) throw new errorHandler(404, "Invoice Not Found")
        res.status(200).json({
            message: "SUCCES",
            data: getInvoice
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {
    getInvoiceList,
    getSingleInvoice
}