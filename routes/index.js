module.exports = (app) => {
    // require('./base')(app)
    require('./master-data')(app)
    require('./base')(app)
}