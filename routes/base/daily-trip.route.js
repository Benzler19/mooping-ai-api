const { authJwt } = require('../../middlewares')
const { DailyTripController } = require('../../controller')

module.exports = function (app) {
    app.post('/loan/trip/getTripBy',          authJwt.verifyToken, DailyTripController.getTripBy)
    app.post('/loan/trip/getTripById',        authJwt.verifyToken, DailyTripController.getTripById)
    app.post('/loan/trip/getTripWithDetails', authJwt.verifyToken, DailyTripController.getTripWithDetails)
    app.post('/loan/trip/insertTrip',         authJwt.verifyToken, DailyTripController.insertTrip)
    app.post('/loan/trip/updateTripById',     authJwt.verifyToken, DailyTripController.updateTripById)
    app.post('/loan/trip/submitTrip',         authJwt.verifyToken, DailyTripController.submitTrip)
    app.post('/loan/trip/verifyTrip',         authJwt.verifyToken, DailyTripController.verifyTrip)
    app.post('/loan/trip/deleteTripById',     authJwt.verifyToken, DailyTripController.deleteTripById)
}
