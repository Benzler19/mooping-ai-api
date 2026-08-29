const { SupplierService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getSupplierBy      = withConnection(SupplierService.getSupplierBy)
Task.insertSupplier     = withTransaction(SupplierService.insertSupplier)
Task.updateSupplierById = withTransaction(SupplierService.updateSupplierById)
Task.deleteSupplierById = withTransaction(SupplierService.deleteSupplierById)

module.exports = Task
