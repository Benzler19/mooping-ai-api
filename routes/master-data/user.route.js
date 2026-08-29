const { authJwt } = require("../../middlewares")
const { UserController } = require('../../controller')

module.exports = function (app) {
    app.post('/user/checkLogin', UserController.checkLogin)
    app.post('/user/getUserBy', authJwt.verifyToken, UserController.getUserBy)
    app.post('/user/getUserById', authJwt.verifyToken, UserController.getUserById)
    app.post('/user/insertUser', authJwt.verifyToken, UserController.insertUser)
    app.post('/user/updateUserById', authJwt.verifyToken, UserController.updateUserById)
    app.post('/user/deleteUserById', authJwt.verifyToken, UserController.deleteUserById)
}
