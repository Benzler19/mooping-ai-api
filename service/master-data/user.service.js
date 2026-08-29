const { UserModel } = require("../../models")
const APP_CONFIG = require("../../configs/app")
const jwt = require("jsonwebtoken")

const Task = function (task) {
    this.task = task.task
}

Task.checkLogin = async (data, connection) => {
    const result = await UserModel.checkLogin(data, connection)
    if (!result.require) return result
    const { user_id, user_uuid } = result.data[0]
    const x_access_token = jwt.sign({ user_id, user_uuid }, APP_CONFIG.secret, { expiresIn: 86400 })
    return { ...result, x_access_token }
}

Task.getUserBy      = (data, connection) => UserModel.getUserBy(data, connection)
Task.getUserById    = (data, connection) => UserModel.getUserById(data, connection)
Task.insertUser     = (data, connection) => UserModel.insertUser(data, connection)
Task.updateUserById = (data, connection) => UserModel.updateUserById(data, connection)
Task.deleteUserById = (data, connection) => UserModel.deleteUserById(data, connection)

module.exports = Task
