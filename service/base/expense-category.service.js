const { ExpenseCategoryModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getExpenseCategoryBy      = (data, connection) => ExpenseCategoryModel.getExpenseCategoryBy(data, connection)
Task.insertExpenseCategory     = (data, connection) => ExpenseCategoryModel.insertExpenseCategory(data, connection)
Task.deleteExpenseCategoryById = (data, connection) => ExpenseCategoryModel.deleteExpenseCategoryById(data, connection)

module.exports = Task
