const { UserService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) {
    this.task = task.task
}

Task.generateMemberLastCode = withConnection(UserService.generateMemberLastCode)
Task.checkLogin             = withConnection(UserService.checkLogin)
Task.checkUser              = withConnection(UserService.checkUser)
Task.getUserBy              = withConnection(UserService.getUserBy)
Task.getUserById            = withConnection(UserService.getUserById)
Task.getLoginToken          = withConnection(UserService.getLoginToken)
Task.insertUser             = withTransaction(UserService.insertUser)
Task.updateUserById         = withTransaction(UserService.updateUserById)
Task.deleteUserById         = withTransaction(UserService.deleteUserById)

module.exports = Task
