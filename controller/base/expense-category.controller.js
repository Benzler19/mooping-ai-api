const { ExpenseCategoryService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getExpenseCategoryBy      = withConnection(ExpenseCategoryService.getExpenseCategoryBy)
Task.insertExpenseCategory     = withTransaction(ExpenseCategoryService.insertExpenseCategory)
Task.deleteExpenseCategoryById = withTransaction(ExpenseCategoryService.deleteExpenseCategoryById)

module.exports = Task
