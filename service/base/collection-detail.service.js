const { CollectionDetailModel, BorrowerModel } = require("../../models")

const Task = function (task) {
    this.task = task.task
}

Task.getCollectionByTrip    = (data, connection) => CollectionDetailModel.getCollectionByTrip(data, connection)
Task.deleteCollectionByTrip = (data, connection) => CollectionDetailModel.deleteCollectionByTrip(data, connection)

Task.saveCollection = async (data, connection) => {
    const result = await CollectionDetailModel.saveCollection(data, connection)

    // อัปเดต outstanding_balance และ missed_count ของผู้กู้
    const borrower = await BorrowerModel.getBorrowerById({ borrower_id: data.borrower_id }, connection)
    if (borrower.require && borrower.data.length > 0) {
        const missed = data.collected_amount === 0 ? borrower.data[0].missed_count + 1 : 0
        await BorrowerModel.updateBorrowerById({
            ...borrower.data[0],
            outstanding_balance: borrower.data[0].outstanding_balance - data.collected_amount,
            missed_count:        missed,
            is_cut:              data.is_cut || 0,
            update_by:           data.create_by,
        }, connection)
    }

    return result
}

module.exports = Task
