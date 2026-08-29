const { ProductModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getProductBy      = (data, connection) => ProductModel.getProductBy(data, connection)
Task.getProductById    = (data, connection) => ProductModel.getProductById(data, connection)
Task.getProductForSale = (data, connection) => ProductModel.getProductForSale(data, connection)
Task.insertProduct     = (data, connection) => ProductModel.insertProduct(data, connection)
Task.updateProductById = (data, connection) => ProductModel.updateProductById(data, connection)
Task.deleteProductById = (data, connection) => ProductModel.deleteProductById(data, connection)

module.exports = Task
