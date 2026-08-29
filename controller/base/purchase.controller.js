const { PurchaseService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getPurchaseBy      = withConnection(PurchaseService.getPurchaseBy)
Task.getPurchaseById    = withConnection(PurchaseService.getPurchaseById)
Task.insertPurchase     = withTransaction(PurchaseService.insertPurchase)
Task.deletePurchaseById = withTransaction(PurchaseService.deletePurchaseById)

module.exports = Task
