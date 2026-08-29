module.exports = (app) => {
    require('./role.route')(app)
    require('./permission.route')(app)
    require('./user.route')(app)
}