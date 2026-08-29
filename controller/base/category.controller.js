const { CategoryService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getCategoryBy      = withConnection(CategoryService.getCategoryBy)
Task.getCategoryById    = withConnection(CategoryService.getCategoryById)
Task.insertCategory     = withTransaction(CategoryService.insertCategory)
Task.updateCategoryById = withTransaction(CategoryService.updateCategoryById)
Task.deleteCategoryById = withTransaction(CategoryService.deleteCategoryById)

module.exports = Task
