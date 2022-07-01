const Sales = require('../models').sales
const Invoice = require('../models').invoice
const errorHandler = require('../utils/errorHandler')
const { getPagination, getPagingData } = require("../utils/pagination")

async function addSales(req, res, next) {
    try {
        const date = new Date()
        const month = ["January","February","March","April","May","June","July","August","September","October","November","December"]        
        let dd = String(date.getDate()).padStart(2, '0')
        let mm = String(date.getMonth() + 1).padStart(2, '0')
        let yyyy = date.getFullYear()
        const today = mm + '/' + dd + '/' + yyyy;
        const thisMonth = month[date.getMonth()]
        const {name, price, type} = req.body

        if(!name) throw new errorHandler(400, "Please Input Name!!")
        if(!price) throw new errorHandler(400, "Please Input Price!!")
        if(!type) throw new errorHandler(400, "Please Input Type!!")

        const newSales = await Sales.create({
            name,
            price,
            type
        })

        if(newSales){
            await Invoice.create({
                sales_id: newSales.sales_id,
                name : name,
                price : price,
                date: type === "day" ? today : thisMonth
            })
    
            res.status(200).json({
                message: "SUCCESS",
                data: newSales
            })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function getSalesList(req, res, next) {
    try {
        const {pageNumber, pageSize} = req.body
        const {limit, offset} = getPagination(pageNumber, pageSize)
        
        const listSales = await Sales.findAndCountAll({
            limit: limit,
			offset: offset,
            include: "invoice",
			order: [["created_at", "DESC"]],
        })

		const responseData = getPagingData(listSales, pageNumber, limit);

        res.status(200).json({
            message: "SUCCESS",
            data: responseData
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function getSingleSales(req, res, next) {
    const id = req.params.id
    try {
        const getSales = await Sales.findByPk(id, {include: "invoice"})

        if(!getSales) throw new errorHandler(404, "Sales Not Found")
        res.status(200).json({
            message: "SUCCES",
            data: getSales
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function deleteSales(req, res, next) {
    const id = req.params.id
    try {
        const findSales = await Sales.findByPk(id)

        const deleteInvoice = await Invoice.destroy({
            where: {
                sales_id : id
            }
        })

        if(deleteInvoice){
            await findSales.destroy()
            res.status(200).json({
                message: "SUCCES DELETE SALES",
                data: findSales
            })
        }
    } catch (error) {
        
    }
}

module.exports = {
    addSales,
    getSalesList,
    getSingleSales,
    deleteSales
}