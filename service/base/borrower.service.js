const { BorrowerModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getBorrowerBy      = (data, connection) => BorrowerModel.getBorrowerBy(data, connection)
Task.getBorrowerById    = (data, connection) => BorrowerModel.getBorrowerById(data, connection)
Task.insertBorrower     = (data, connection) => BorrowerModel.insertBorrower(data, connection)
Task.updateBorrowerById = (data, connection) => BorrowerModel.updateBorrowerById(data, connection)
Task.deleteBorrowerById = (data, connection) => BorrowerModel.deleteBorrowerById(data, connection)

module.exports = Task
