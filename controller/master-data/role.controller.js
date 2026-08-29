const { RoleService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) {
    this.task = task.task
}

Task.getRoleBy      = withConnection(RoleService.getRoleBy)
Task.getRoleById    = withConnection(RoleService.getRoleById)
Task.insertRole     = withTransaction(RoleService.insertRole)
Task.updateRoleById = withTransaction(RoleService.updateRoleById)
Task.deleteRoleById = withTransaction(RoleService.deleteRoleById)

module.exports = Task
