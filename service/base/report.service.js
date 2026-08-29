const { ReportModel, IngredientModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getSummary      = (data, connection) => ReportModel.getSummary(data, connection)
Task.getDailySales   = (data, connection) => ReportModel.getDailySales(data, connection)
Task.getTopProducts  = (data, connection) => ReportModel.getTopProducts(data, connection)

Task.getDashboard = async (data, connection) => {
    const [summary, dailySales, topProducts, lowStock] = await Promise.all([
        ReportModel.getSummary(data, connection),
        ReportModel.getDailySales(data, connection),
        ReportModel.getTopProducts({ ...data, limit: 5 }, connection),
        IngredientModel.getLowStock(data, connection),
    ])
    return {
        data: {
            summary: summary.data,
            daily_sales: dailySales.data,
            top_products: topProducts.data,
            low_stock: lowStock.data,
        },
        require: true,
    }
}

module.exports = Task
