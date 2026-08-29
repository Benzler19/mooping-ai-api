const { RecipeModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getRecipeByProduct = (data, connection) => RecipeModel.getRecipeByProduct(data, connection)
Task.saveRecipe         = (data, connection) => RecipeModel.saveRecipe(data, connection)

module.exports = Task
