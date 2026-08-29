const { DailyTripModel, CollectionDetailModel, BorrowerModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getTripBy    = (data, connection) => DailyTripModel.getTripBy(data, connection)
Task.getTripById  = (data, connection) => DailyTripModel.getTripById(data, connection)
Task.insertTrip   = (data, connection) => DailyTripModel.insertTrip(data, connection)
Task.updateTripById = (data, connection) => DailyTripModel.updateTripById(data, connection)
Task.deleteTripById = (data, connection) => DailyTripModel.deleteTripById(data, connection)

Task.submitTrip = async (data, connection) => {
    const result = await DailyTripModel.submitTrip(data, connection)
    if (result.data.affectedRows === 0) {
        throw { data: [], require: false, err: 'ไม่สามารถ submit ได้ (สถานะไม่ใช่ draft หรือไม่พบ trip)' }
    }
    return result
}

Task.verifyTrip = async (data, connection) => {
    const result = await DailyTripModel.verifyTrip(data, connection)
    if (result.data.affectedRows === 0) {
        throw { data: [], require: false, err: 'ไม่สามารถ verify ได้ (สถานะไม่ใช่ submitted หรือไม่พบ trip)' }
    }
    return result
}

Task.getTripWithDetails = async (data, connection) => {
    const trip = await DailyTripModel.getTripById(data, connection)
    if (!trip.require || trip.data.length === 0) {
        throw { data: [], require: false, err: 'ไม่พบ trip' }
    }
    const details = await CollectionDetailModel.getCollectionByTrip(data, connection)
    return { data: { trip: trip.data[0], details: details.data }, require: true }
}

module.exports = Task
