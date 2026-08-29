const { UserService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) {
    this.task = task.task
}

Task.checkLogin     = withConnection(UserService.checkLogin)
Task.getUserBy      = withConnection(UserService.getUserBy)
Task.getUserById    = withConnection(UserService.getUserById)
Task.insertUser     = withTransaction(UserService.insertUser)
Task.updateUserById = withTransaction(UserService.updateUserById)
Task.deleteUserById = withTransaction(UserService.deleteUserById)

module.exports = Task
