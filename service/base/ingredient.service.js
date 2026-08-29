const { IngredientModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getIngredientBy        = (data, connection) => IngredientModel.getIngredientBy(data, connection)
Task.getIngredientById      = (data, connection) => IngredientModel.getIngredientById(data, connection)
Task.getIngredientForRecipe = (data, connection) => IngredientModel.getIngredientForRecipe(data, connection)
Task.getLowStock            = (data, connection) => IngredientModel.getLowStock(data, connection)
Task.insertIngredient       = (data, connection) => IngredientModel.insertIngredient(data, connection)
Task.updateIngredientById   = (data, connection) => IngredientModel.updateIngredientById(data, connection)
Task.adjustStock            = (data, connection) => IngredientModel.adjustStock(data, connection)
Task.deleteIngredientById   = (data, connection) => IngredientModel.deleteIngredientById(data, connection)

module.exports = Task
