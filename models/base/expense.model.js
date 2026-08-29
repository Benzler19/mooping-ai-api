const db = require("../../configs/db.json")

const Task = function (task) {
    this.task = task.task
}

Task.getExpenseBy = async function (data, connection) {
    try {
        const { filters, sorter, pagination, params } = connection.generatePageBy(data.params)
        const sql = `
            SELECT tb1.expense_id, tb1.expense_date, tb1.expense_category_id, tb1.amount, tb1.note,
                   tb2.category_name
            FROM ${db["base"]}.tb_expense AS tb1
            LEFT JOIN ${db["base"]}.tb_expense_category AS tb2 ON tb1.expense_category_id = tb2.expense_category_id
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        const [res] = await connection.query(sql, params)
        if (pagination === "") return { data: res, require: true }
        const [res_total] = await connection.query(`SELECT COUNT(*) AS total FROM ${db["base"]}.tb_expense AS tb1 WHERE ${filters}`, params)
        return { data: res, total: res_total[0].total, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.getExpenseById = async function (data, connection) {
    try {
        const sql = `SELECT * FROM ${db["base"]}.tb_expense WHERE expense_id = ${connection.escape(data.expense_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.insertExpense = async function (data, connection) {
    try {
        const sql = `
            INSERT INTO ${db["base"]}.tb_expense SET
            expense_date        = ${connection.escape(data.expense_date)},
            expense_category_id = ${connection.escape(data.expense_category_id)},
            amount              = ${connection.escape(data.amount)},
            note                = ${connection.escape(data.note || null)},
            create_date         = NOW(),
            create_by           = ${connection.escape(data.create_by)}
        `
        const [res] = await connection.query(sql)
        return { data: { expense_id: res.insertId }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.updateExpenseById = async function (data, connection) {
    try {
        const sql = `
            UPDATE ${db["base"]}.tb_expense SET
            expense_date        = ${connection.escape(data.expense_date)},
            expense_category_id = ${connection.escape(data.expense_category_id)},
            amount              = ${connection.escape(data.amount)},
            note                = ${connection.escape(data.note)}
            WHERE expense_id = ${connection.escape(data.expense_id)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.deleteExpenseById = async function (data, connection) {
    try {
        const sql = `DELETE FROM ${db["base"]}.tb_expense WHERE expense_id = ${connection.escape(data.expense_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
