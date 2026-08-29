const { SaleOrderService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getSaleOrderBy          = withConnection(SaleOrderService.getSaleOrderBy)
Task.getSaleOrderWithDetails = withConnection(SaleOrderService.getSaleOrderWithDetails)
Task.insertSaleOrder         = withTransaction(SaleOrderService.insertSaleOrder)
Task.cancelSaleOrder         = withTransaction(SaleOrderService.cancelSaleOrder)

module.exports = Task
