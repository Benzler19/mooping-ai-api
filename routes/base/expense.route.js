const { authJwt } = require('../../middlewares')
const { ExpenseController } = require('../../controller')

module.exports = function (app) {
    app.post('/shop/expense/getExpenseBy',      authJwt.verifyToken, ExpenseController.getExpenseBy)
    app.post('/shop/expense/getExpenseById',    authJwt.verifyToken, ExpenseController.getExpenseById)
    app.post('/shop/expense/insertExpense',     authJwt.verifyToken, ExpenseController.insertExpense)
    app.post('/shop/expense/updateExpenseById', authJwt.verifyToken, ExpenseController.updateExpenseById)
    app.post('/shop/expense/deleteExpenseById', authJwt.verifyToken, ExpenseController.deleteExpenseById)
}
