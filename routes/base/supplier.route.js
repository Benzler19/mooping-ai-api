const { authJwt } = require('../../middlewares')
const { SupplierController } = require('../../controller')

module.exports = function (app) {
    app.post('/shop/supplier/getSupplierBy',      authJwt.verifyToken, SupplierController.getSupplierBy)
    app.post('/shop/supplier/insertSupplier',     authJwt.verifyToken, SupplierController.insertSupplier)
    app.post('/shop/supplier/updateSupplierById', authJwt.verifyToken, SupplierController.updateSupplierById)
    app.post('/shop/supplier/deleteSupplierById', authJwt.verifyToken, SupplierController.deleteSupplierById)
}
