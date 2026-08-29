const { SupplierModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getSupplierBy      = (data, connection) => SupplierModel.getSupplierBy(data, connection)
Task.insertSupplier     = (data, connection) => SupplierModel.insertSupplier(data, connection)
Task.updateSupplierById = (data, connection) => SupplierModel.updateSupplierById(data, connection)
Task.deleteSupplierById = (data, connection) => SupplierModel.deleteSupplierById(data, connection)

module.exports = Task
