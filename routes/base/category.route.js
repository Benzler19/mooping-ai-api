const { authJwt } = require('../../middlewares')
const { CategoryController } = require('../../controller')

module.exports = function (app) {
    app.post('/shop/category/getCategoryBy',      authJwt.verifyToken, CategoryController.getCategoryBy)
    app.post('/shop/category/getCategoryById',    authJwt.verifyToken, CategoryController.getCategoryById)
    app.post('/shop/category/insertCategory',     authJwt.verifyToken, CategoryController.insertCategory)
    app.post('/shop/category/updateCategoryById', authJwt.verifyToken, CategoryController.updateCategoryById)
    app.post('/shop/category/deleteCategoryById', authJwt.verifyToken, CategoryController.deleteCategoryById)
}
