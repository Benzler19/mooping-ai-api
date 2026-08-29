const { authJwt } = require('../../middlewares')
const { CollectionDetailController } = require('../../controller')

module.exports = function (app) {
    app.post('/loan/collection/getCollectionByTrip',    authJwt.verifyToken, CollectionDetailController.getCollectionByTrip)
    app.post('/loan/collection/saveCollection',         authJwt.verifyToken, CollectionDetailController.saveCollection)
    app.post('/loan/collection/deleteCollectionByTrip', authJwt.verifyToken, CollectionDetailController.deleteCollectionByTrip)
}
