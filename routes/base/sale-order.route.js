const { authJwt } = require('../../middlewares')
const { SaleOrderController } = require('../../controller')

module.exports = function (app) {
    app.post('/shop/sale/getSaleOrderBy',          authJwt.verifyToken, SaleOrderController.getSaleOrderBy)
    app.post('/shop/sale/getSaleOrderWithDetails', authJwt.verifyToken, SaleOrderController.getSaleOrderWithDetails)
    app.post('/shop/sale/insertSaleOrder',         authJwt.verifyToken, SaleOrderController.insertSaleOrder)
    app.post('/shop/sale/cancelSaleOrder',         authJwt.verifyToken, SaleOrderController.cancelSaleOrder)
}
