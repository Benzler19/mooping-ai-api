const { authJwt } = require('../../middlewares')
const { BorrowerController } = require('../../controller')

module.exports = function (app) {
    app.post('/loan/borrower/getBorrowerBy',      authJwt.verifyToken, BorrowerController.getBorrowerBy)
    app.post('/loan/borrower/getBorrowerById',    authJwt.verifyToken, BorrowerController.getBorrowerById)
    app.post('/loan/borrower/insertBorrower',     authJwt.verifyToken, BorrowerController.insertBorrower)
    app.post('/loan/borrower/updateBorrowerById', authJwt.verifyToken, BorrowerController.updateBorrowerById)
    app.post('/loan/borrower/deleteBorrowerById', authJwt.verifyToken, BorrowerController.deleteBorrowerById)
}
