const APP_CONFIG = require("../../configs/app")
const jwt = require("jsonwebtoken")
const { PermissionModel, RoleModel } = require("../../models")

const Task = function (task) {
  this.task = task.task
}
Task.getPermissionBy = (data, connection) => PermissionModel.getPermissionBy(data, connection)
Task.updatePermissionById = async (data, connection) => {
  try {
    let permission =await PermissionModel.updatePermissionById(data, connection)
    await RoleModel.updateRoleById(data, connection)
    return permission
  } catch (error) {
    throw error
  }
}
Task.insertPermission = async (data, connection) => {
  try {
    if (!data.role_id) {
      const role = await RoleModel.insertRole(data, connection)
      data.role_id = role.data.role_id
    }
    await PermissionModel.insertPermission(data, connection)
    return { data: { role_id: data.role_id }, require: true }
  } catch (error) {
    throw error
  }
}

module.exports = Task
