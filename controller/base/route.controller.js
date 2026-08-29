const { RouteService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getRouteBy      = withConnection(RouteService.getRouteBy)
Task.getRouteById    = withConnection(RouteService.getRouteById)
Task.insertRoute     = withTransaction(RouteService.insertRoute)
Task.updateRouteById = withTransaction(RouteService.updateRouteById)
Task.deleteRouteById = withTransaction(RouteService.deleteRouteById)

module.exports = Task
