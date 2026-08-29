const { authJwt } = require("../../middlewares");
const { RoleController } = require('../../controller');

module.exports = function (app) {
    app.post('/role/getRoleBy', authJwt.verifyToken, RoleController.getRoleBy);
    app.post('/role/getRoleById', authJwt.verifyToken, RoleController.getRoleById);
    app.post('/role/insertRole', authJwt.verifyToken, RoleController.insertRole);
    app.post('/role/updateRoleById', authJwt.verifyToken, RoleController.updateRoleById);
    app.post('/role/deleteRoleById', authJwt.verifyToken, RoleController.deleteRoleById);
};
