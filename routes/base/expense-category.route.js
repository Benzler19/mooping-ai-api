const { authJwt } = require('../../middlewares')
const { ExpenseCategoryController } = require('../../controller')

module.exports = function (app) {
    app.post('/shop/expenseCategory/getExpenseCategoryBy',      authJwt.verifyToken, ExpenseCategoryController.getExpenseCategoryBy)
    app.post('/shop/expenseCategory/insertExpenseCategory',     authJwt.verifyToken, ExpenseCategoryController.insertExpenseCategory)
    app.post('/shop/expenseCategory/deleteExpenseCategoryById', authJwt.verifyToken, ExpenseCategoryController.deleteExpenseCategoryById)
}
