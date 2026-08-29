const { DailyTripService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getTripBy          = withConnection(DailyTripService.getTripBy)
Task.getTripById        = withConnection(DailyTripService.getTripById)
Task.getTripWithDetails = withConnection(DailyTripService.getTripWithDetails)
Task.insertTrip         = withTransaction(DailyTripService.insertTrip)
Task.updateTripById     = withTransaction(DailyTripService.updateTripById)
Task.submitTrip         = withTransaction(DailyTripService.submitTrip)
Task.verifyTrip         = withTransaction(DailyTripService.verifyTrip)
Task.deleteTripById     = withTransaction(DailyTripService.deleteTripById)

module.exports = Task
