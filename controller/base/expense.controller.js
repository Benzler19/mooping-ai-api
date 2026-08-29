const { ExpenseService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getExpenseBy      = withConnection(ExpenseService.getExpenseBy)
Task.getExpenseById    = withConnection(ExpenseService.getExpenseById)
Task.insertExpense     = withTransaction(ExpenseService.insertExpense)
Task.updateExpenseById = withTransaction(ExpenseService.updateExpenseById)
Task.deleteExpenseById = withTransaction(ExpenseService.deleteExpenseById)

module.exports = Task
