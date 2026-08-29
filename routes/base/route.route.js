const { authJwt } = require('../../middlewares')
const { RouteController } = require('../../controller')

module.exports = function (app) {
    app.post('/loan/route/getRouteBy',      authJwt.verifyToken, RouteController.getRouteBy)
    app.post('/loan/route/getRouteById',    authJwt.verifyToken, RouteController.getRouteById)
    app.post('/loan/route/insertRoute',     authJwt.verifyToken, RouteController.insertRoute)
    app.post('/loan/route/updateRouteById', authJwt.verifyToken, RouteController.updateRouteById)
    app.post('/loan/route/deleteRouteById', authJwt.verifyToken, RouteController.deleteRouteById)
}
