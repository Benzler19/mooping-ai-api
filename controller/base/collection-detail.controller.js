const { CollectionDetailService } = require('../../service')
const { withConnection, withTransaction } = require('../../middlewares')

const Task = function (task) { this.task = task.task }

Task.getCollectionByTrip    = withConnection(CollectionDetailService.getCollectionByTrip)
Task.saveCollection         = withTransaction(CollectionDetailService.saveCollection)
Task.deleteCollectionByTrip = withTransaction(CollectionDetailService.deleteCollectionByTrip)

module.exports = Task
