const { IngredientService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getIngredientBy        = withConnection(IngredientService.getIngredientBy)
Task.getIngredientById      = withConnection(IngredientService.getIngredientById)
Task.getIngredientForRecipe = withConnection(IngredientService.getIngredientForRecipe)
Task.getLowStock            = withConnection(IngredientService.getLowStock)
Task.insertIngredient       = withTransaction(IngredientService.insertIngredient)
Task.updateIngredientById   = withTransaction(IngredientService.updateIngredientById)
Task.adjustStock            = withTransaction(IngredientService.adjustStock)
Task.deleteIngredientById   = withTransaction(IngredientService.deleteIngredientById)

module.exports = Task
