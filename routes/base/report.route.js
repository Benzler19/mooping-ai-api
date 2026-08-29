const { authJwt } = require('../../middlewares')
const { ReportController } = require('../../controller')

module.exports = function (app) {
    app.post('/shop/report/getSummary',     authJwt.verifyToken, ReportController.getSummary)
    app.post('/shop/report/getDailySales',  authJwt.verifyToken, ReportController.getDailySales)
    app.post('/shop/report/getTopProducts', authJwt.verifyToken, ReportController.getTopProducts)
    app.post('/shop/report/getDashboard',   authJwt.verifyToken, ReportController.getDashboard)
}
