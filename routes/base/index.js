module.exports = (app) => {
    require('./category.route')(app)
    require('./product.route')(app)
    require('./ingredient.route')(app)
    require('./recipe.route')(app)
    require('./supplier.route')(app)
    require('./purchase.route')(app)
    require('./sale-order.route')(app)
    require('./expense-category.route')(app)
    require('./expense.route')(app)
    require('./report.route')(app)
}
