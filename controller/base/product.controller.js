const { ProductService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getProductBy      = withConnection(ProductService.getProductBy)
Task.getProductById    = withConnection(ProductService.getProductById)
Task.getProductForSale = withConnection(ProductService.getProductForSale)
Task.insertProduct     = withTransaction(ProductService.insertProduct)
Task.updateProductById = withTransaction(ProductService.updateProductById)
Task.deleteProductById = withTransaction(ProductService.deleteProductById)

module.exports = Task
