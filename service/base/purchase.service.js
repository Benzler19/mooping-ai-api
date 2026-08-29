const { PurchaseModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getPurchaseBy      = (data, connection) => PurchaseModel.getPurchaseBy(data, connection)
Task.getPurchaseById    = (data, connection) => PurchaseModel.getPurchaseById(data, connection)
Task.insertPurchase     = (data, connection) => PurchaseModel.insertPurchase(data, connection)
Task.deletePurchaseById = (data, connection) => PurchaseModel.deletePurchaseById(data, connection)

module.exports = Task
