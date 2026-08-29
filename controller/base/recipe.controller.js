const { RecipeService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getRecipeByProduct = withConnection(RecipeService.getRecipeByProduct)
Task.saveRecipe         = withTransaction(RecipeService.saveRecipe)

module.exports = Task
