const { SaleOrderModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getSaleOrderBy    = (data, connection) => SaleOrderModel.getSaleOrderBy(data, connection)
Task.insertSaleOrder   = (data, connection) => SaleOrderModel.insertSaleOrder(data, connection)
Task.cancelSaleOrder   = (data, connection) => SaleOrderModel.cancelSaleOrder(data, connection)

Task.getSaleOrderWithDetails = async (data, connection) => {
    const order = await SaleOrderModel.getSaleOrderById(data, connection)
    if (!order.require || order.data.length === 0) {
        throw { data: [], require: false, err: "ไม่พบบิลขาย" }
    }
    const details = await SaleOrderModel.getSaleOrderDetailByOrder(data, connection)
    return { data: { order: order.data[0], details: details.data }, require: true }
}

module.exports = Task
