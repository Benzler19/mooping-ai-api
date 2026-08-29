module.exports = (app) => {
    require('./route.route')(app)
    require('./borrower.route')(app)
    require('./daily-trip.route')(app)
    require('./collection-detail.route')(app)
}
