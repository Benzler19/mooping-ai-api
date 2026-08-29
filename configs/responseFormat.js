module.exports = (req, res, next) => {
    res.success = (data = { data: [], require: true }, statusCode = 200) => {
        res.status(statusCode || 200).send(data)
    }

    res.error = (err) => {
        let { message = '', status = 500, } = err
        let errorBody = { status, message }

        console.log('Error log:', err)

        res.status(status || 500).send({ data: [], require: false, error: errorBody })
    }

    next()
}