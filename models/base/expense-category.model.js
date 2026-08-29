const db = require("../../configs/db.json")

const Task = function (task) {
    this.task = task.task
}

Task.getExpenseCategoryBy = async function (data, connection) {
    try {
        const sql = `
            SELECT expense_category_id, category_name, status
            FROM ${db["base"]}.tb_expense_category
            WHERE status = 1
            ORDER BY category_name
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.insertExpenseCategory = async function (data, connection) {
    try {
        const sql = `
            INSERT INTO ${db["base"]}.tb_expense_category SET
            category_name = ${connection.escape(data.category_name)},
            status        = 1
        `
        const [res] = await connection.query(sql)
        return { data: { expense_category_id: res.insertId }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.deleteExpenseCategoryById = async function (data, connection) {
    try {
        const sql = `DELETE FROM ${db["base"]}.tb_expense_category WHERE expense_category_id = ${connection.escape(data.expense_category_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
