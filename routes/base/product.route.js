const { authJwt } = require('../../middlewares')
const { ProductController } = require('../../controller')

module.exports = function (app) {
    app.post('/shop/product/getProductBy',      authJwt.verifyToken, ProductController.getProductBy)
    app.post('/shop/product/getProductById',    authJwt.verifyToken, ProductController.getProductById)
    app.post('/shop/product/getProductForSale', authJwt.verifyToken, ProductController.getProductForSale)
    app.post('/shop/product/insertProduct',     authJwt.verifyToken, ProductController.insertProduct)
    app.post('/shop/product/updateProductById', authJwt.verifyToken, ProductController.updateProductById)
    app.post('/shop/product/deleteProductById', authJwt.verifyToken, ProductController.deleteProductById)
}
