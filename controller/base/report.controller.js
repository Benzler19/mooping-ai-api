const { ReportService } = require('../../service')
const { withConnection } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getSummary     = withConnection(ReportService.getSummary)
Task.getDailySales  = withConnection(ReportService.getDailySales)
Task.getTopProducts = withConnection(ReportService.getTopProducts)
Task.getDashboard   = withConnection(ReportService.getDashboard)

module.exports = Task
