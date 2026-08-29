const { BorrowerService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getBorrowerBy      = withConnection(BorrowerService.getBorrowerBy)
Task.getBorrowerById    = withConnection(BorrowerService.getBorrowerById)
Task.insertBorrower     = withTransaction(BorrowerService.insertBorrower)
Task.updateBorrowerById = withTransaction(BorrowerService.updateBorrowerById)
Task.deleteBorrowerById = withTransaction(BorrowerService.deleteBorrowerById)

module.exports = Task
