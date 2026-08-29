const { PermissionService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) {
    this.task = task.task
}

Task.getPermissionBy      = withConnection(PermissionService.getPermissionBy)
Task.insertPermission     = withTransaction(PermissionService.insertPermission)
Task.updatePermissionById = withTransaction(PermissionService.updatePermissionById)

module.exports = Task
