const { CategoryModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getCategoryBy      = (data, connection) => CategoryModel.getCategoryBy(data, connection)
Task.getCategoryById    = (data, connection) => CategoryModel.getCategoryById(data, connection)
Task.insertCategory     = (data, connection) => CategoryModel.insertCategory(data, connection)
Task.updateCategoryById = (data, connection) => CategoryModel.updateCategoryById(data, connection)
Task.deleteCategoryById = (data, connection) => CategoryModel.deleteCategoryById(data, connection)

module.exports = Task
