// Models/base/room.service.js
const { RoleModel,PermissionModel } = require("../../models")

const Task = function (task) {
  this.task = task.task
}

Task.getRoleBy = (data, connection) => RoleModel.getRoleBy(data, connection)
Task.getRoleById = (data, connection) => RoleModel.getRoleById(data, connection)
Task.insertRole = (data, connection) => RoleModel.insertRole(data, connection)
Task.updateRoleById = (data, connection) =>RoleModel.updateRoleById(data, connection)
Task.deleteRoleById = async (data, connection) =>{
  await PermissionModel.deletePermissionById(data, connection)
  await RoleModel.deleteRoleById(data, connection)
}
module.exports = Task
