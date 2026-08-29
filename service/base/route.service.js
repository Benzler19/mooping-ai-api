const { RouteModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getRouteBy      = (data, connection) => RouteModel.getRouteBy(data, connection)
Task.getRouteById    = (data, connection) => RouteModel.getRouteById(data, connection)
Task.insertRoute     = (data, connection) => RouteModel.insertRoute(data, connection)
Task.updateRouteById = (data, connection) => RouteModel.updateRouteById(data, connection)
Task.deleteRouteById = (data, connection) => RouteModel.deleteRouteById(data, connection)

module.exports = Task
