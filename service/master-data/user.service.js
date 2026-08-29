const { UserModel, PermissionModel } = require("../../models")
const APP_CONFIG = require("../../configs/app")
const jwt = require("jsonwebtoken")

const Task = function (task) {
  this.task = task.task
}

const buildAuthTokens = async (user, connection) => {
  const { user_table_uuid, role_id } = user
  const permissions = await PermissionModel.getPermissionBy({ role_id }, connection)
  if (!permissions.require) return {}
  return {
    x_access_token:    jwt.sign({ user_table_uuid }, APP_CONFIG.secret, { expiresIn: 86400 }),
    permissions_token: jwt.sign({ permissions: permissions.data }, APP_CONFIG.secret, { expiresIn: 86400 }),
  }
}

Task.generateMemberLastCode = async (data, connection) => UserModel.generateMemberLastCode(data, connection)

Task.checkLogin = async (data, connection) => {
  const result = await UserModel.checkLogin(data, connection)
  if (!result.require) return result
  const tokens = await buildAuthTokens(result.data[0], connection)
  return { ...result, ...tokens }
}

Task.getLoginToken = async (data, connection) => {
  const result = await UserModel.checkLogin(data, connection)
  if (!result.require) return result
  const { x_access_token } = await buildAuthTokens(result.data[0], connection)
  return { x_access_token }
}

Task.checkUser      = (data, connection) => UserModel.checkUser(data, connection)
Task.getUserBy      = (data, connection) => UserModel.getUserBy(data, connection)
Task.getUserById    = (data, connection) => UserModel.getUserById(data, connection)
Task.insertUser     = (data, connection) => UserModel.insertUser(data, connection)
Task.updateUserById = (data, connection) => UserModel.updateUserById(data, connection)
Task.deleteUserById = (data, connection) => UserModel.deleteUserById(data, connection)

module.exports = Task
