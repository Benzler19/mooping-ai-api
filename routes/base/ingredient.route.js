const { authJwt } = require('../../middlewares')
const { IngredientController } = require('../../controller')

module.exports = function (app) {
    app.post('/shop/ingredient/getIngredientBy',        authJwt.verifyToken, IngredientController.getIngredientBy)
    app.post('/shop/ingredient/getIngredientById',      authJwt.verifyToken, IngredientController.getIngredientById)
    app.post('/shop/ingredient/getIngredientForRecipe', authJwt.verifyToken, IngredientController.getIngredientForRecipe)
    app.post('/shop/ingredient/getLowStock',            authJwt.verifyToken, IngredientController.getLowStock)
    app.post('/shop/ingredient/insertIngredient',       authJwt.verifyToken, IngredientController.insertIngredient)
    app.post('/shop/ingredient/updateIngredientById',   authJwt.verifyToken, IngredientController.updateIngredientById)
    app.post('/shop/ingredient/adjustStock',            authJwt.verifyToken, IngredientController.adjustStock)
    app.post('/shop/ingredient/deleteIngredientById',   authJwt.verifyToken, IngredientController.deleteIngredientById)
}
