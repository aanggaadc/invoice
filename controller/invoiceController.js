const Invoice = require('../models').invoice
const errorHandler = require('../utils/errorHandler')
const { getPagination, getPagingData } = require("../utils/pagination")
const generatePDF = require('../utils/generatePDF')


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

async function createPDF (req, res ,next) {
    const id = req.params.id
try {
    const findInvoice = await Invoice.findByPk(id, {include: "sales"})

    const pdf = await generatePDF(`
            <html>
            <head>
            <title>Test PDF</title>
            <style>
                body {
                padding: 60px;
                font-family: "Hevletica Neue", "Helvetica", "Arial", sans-serif;
                font-size: 16px;
                line-height: 24px;
                }

                body > h4 {
                font-size: 24px;
                line-height: 24px;
                text-transform: uppercase;
                margin-bottom: 60px;
                }

                body > header {
                display: flex;
                }

                body > header > .address-block:nth-child(2) {
                margin-left: 100px;
                }

                .address-block address {
                font-style: normal;
                }

                .address-block > h5 {
                font-size: 14px;
                line-height: 14px;
                margin: 0px 0px 15px;
                text-transform: uppercase;
                color: #aaa;
                }

                .table {
                width: 100%;
                margin-top: 60px;
                }

                .table table {
                width: 100%;
                border: 1px solid #eee;
                border-collapse: collapse;
                }

                .table table tr th,
                .table table tr td {
                font-size: 15px;
                padding: 10px;
                border: 1px solid #eee;
                border-collapse: collapse;
                }

                .table table tfoot tr td {
                border-top: 3px solid #eee;
                }
            </style>
            </head>
            <body>
            <h4>Invoice</h4>
            <div class="table">
                <table>
                <thead>
                    <tr>
                    <th style="text-align:left;">Item Name</th>
                    <th>Price</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td style="text-align:left;">${findInvoice.name}</td>
                    <td style="text-align:center;">${findInvoice.price}</td>
                    <td style="text-align:center;">${findInvoice.date}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </body>
        </html>
    `);

    res.set("Content-Type", "application/pdf");
    res.send(pdf);
} catch (error) {
    console.log(error)
    next(error)
    
}
}

module.exports = {
    getInvoiceList,
    getSingleInvoice,
    createPDF
}