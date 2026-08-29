const withConnection = (serviceFn) => (req, res) =>
    req.useConnection(async (connection, success, error) => {
        try {
            success(await serviceFn(req.body, connection))
        } catch (err) {
            error(err)
        }
    })

const withTransaction = (serviceFn) => (req, res) =>
    req.useTransaction(async (connection, success, error) => {
        try {
            success(await serviceFn(req.body, connection))
        } catch (err) {
            error(err)
        }
    })

module.exports = { withConnection, withTransaction }
