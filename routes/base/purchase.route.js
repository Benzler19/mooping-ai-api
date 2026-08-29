const { authJwt } = require('../../middlewares')
const { PurchaseController } = require('../../controller')

module.exports = function (app) {
    app.post('/shop/purchase/getPurchaseBy',      authJwt.verifyToken, PurchaseController.getPurchaseBy)
    app.post('/shop/purchase/getPurchaseById',    authJwt.verifyToken, PurchaseController.getPurchaseById)
    app.post('/shop/purchase/insertPurchase',     authJwt.verifyToken, PurchaseController.insertPurchase)
    app.post('/shop/purchase/deletePurchaseById', authJwt.verifyToken, PurchaseController.deletePurchaseById)
}
