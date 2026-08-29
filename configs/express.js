const express = require('express')

module.exports = (app) => {
    const publicDir = require('path').join(__dirname, '../public/')

    app.use((req, res, next) => {
        const origin = req.get('origin')

        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Credentials', true)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma')
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, school_table_uuid,school_in_group, Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, check_school_table_uuid, check_academic_year_table_uuid, check_year_term')

        req.method === 'OPTIONS' ? res.sendStatus(204) : next()
    })

    app.use(require('./databases'))
    app.use(require('./responseFormat'))

    app.use(express.static(publicDir))
    app.use(express.json({ limit: '50mb', extended: true }))
    app.use(express.urlencoded({ limit: '50mb', extended: true }))
}