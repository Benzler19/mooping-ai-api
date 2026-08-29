const { authJwt } = require("../../middlewares")

const { PermissionController } = require('../../controller')

module.exports = function (app) {

//ssssssF

// หนุยๆๆๆ

    app.post('/permission/getPermissionBy', authJwt.verifyToken,  PermissionController.getPermissionBy)
    app.post('/permission/updatePermissionById', authJwt.verifyToken, PermissionController.updatePermissionById)
    app.post('/permission/insertPermission', authJwt.verifyToken, PermissionController.insertPermission)
}