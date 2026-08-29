const { authJwt } = require('../../middlewares')
const { RecipeController } = require('../../controller')

module.exports = function (app) {
    app.post('/shop/recipe/getRecipeByProduct', authJwt.verifyToken, RecipeController.getRecipeByProduct)
    app.post('/shop/recipe/saveRecipe',         authJwt.verifyToken, RecipeController.saveRecipe)
}
