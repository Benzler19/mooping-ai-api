const { ExpenseModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getExpenseBy      = (data, connection) => ExpenseModel.getExpenseBy(data, connection)
Task.getExpenseById    = (data, connection) => ExpenseModel.getExpenseById(data, connection)
Task.insertExpense     = (data, connection) => ExpenseModel.insertExpense(data, connection)
Task.updateExpenseById = (data, connection) => ExpenseModel.updateExpenseById(data, connection)
Task.deleteExpenseById = (data, connection) => ExpenseModel.deleteExpenseById(data, connection)

module.exports = Task
