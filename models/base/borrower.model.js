const db = require("../../configs/db.json")
const { v4: uuidv4 } = require("uuid")

const Task = function (task) {
    this.task = task.task
}

Task.getBorrowerBy = function (data, connection) {
    return new Promise((resolve, reject) => {
        const { filters, sorter, pagination } = connection.generatePageBy(data.params)
        let sql = `
            SELECT
                tb1.borrower_id, tb1.borrower_uuid, tb1.seq_no,
                tb1.name, tb1.location,
                tb1.loan_amount, tb1.daily_installment, tb1.outstanding_balance,
                tb1.missed_count, tb1.is_cut, tb1.is_active,
                tb2.route_code, tb2.route_name
            FROM ${db["base"]}.tb_borrower AS tb1
            LEFT JOIN ${db["base"]}.tb_route AS tb2 ON tb1.route_id = tb2.route_id
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            if (pagination === "") return resolve({ data: res, require: true })
            sql = `SELECT COUNT(*) AS total FROM ${db["base"]}.tb_borrower WHERE ${filters}`
            connection.query(sql, (err, res_total) => {
                if (err) return reject({ data: [], require: false, err })
                resolve({ data: res, total: res_total[0].total, require: true })
            })
        })
    })
}

Task.getBorrowerById = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                tb1.*, tb2.route_code, tb2.route_name
            FROM ${db["base"]}.tb_borrower AS tb1
            LEFT JOIN ${db["base"]}.tb_route AS tb2 ON tb1.route_id = tb2.route_id
            WHERE tb1.borrower_id = ${connection.escape(data.borrower_id)}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

Task.insertBorrower = function (data, connection) {
    return new Promise((resolve, reject) => {
        const borrower_uuid = uuidv4()
        const sql = `
            INSERT INTO ${db["base"]}.tb_borrower SET
            borrower_uuid       = ${connection.escape(borrower_uuid)},
            route_id            = ${connection.escape(data.route_id)},
            seq_no              = ${connection.escape(data.seq_no)},
            name                = ${connection.escape(data.name)},
            location            = ${connection.escape(data.location)},
            loan_amount         = ${connection.escape(data.loan_amount)},
            daily_installment   = ${connection.escape(data.daily_installment)},
            outstanding_balance = ${connection.escape(data.loan_amount)},
            missed_count        = 0,
            is_cut              = 0,
            is_active           = 1,
            create_date         = NOW(),
            create_by           = ${connection.escape(data.create_by)}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: { borrower_id: res.insertId, borrower_uuid }, require: true })
        })
    })
}

Task.updateBorrowerById = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE ${db["base"]}.tb_borrower SET
            route_id            = ${connection.escape(data.route_id)},
            seq_no              = ${connection.escape(data.seq_no)},
            name                = ${connection.escape(data.name)},
            location            = ${connection.escape(data.location)},
            loan_amount         = ${connection.escape(data.loan_amount)},
            daily_installment   = ${connection.escape(data.daily_installment)},
            outstanding_balance = ${connection.escape(data.outstanding_balance)},
            is_active           = ${connection.escape(data.is_active)},
            update_date         = NOW(),
            update_by           = ${connection.escape(data.update_by)}
            WHERE borrower_id = ${connection.escape(data.borrower_id)}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

Task.deleteBorrowerById = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ${db["base"]}.tb_borrower WHERE borrower_id = ${connection.escape(data.borrower_id)}`
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

module.exports = Task
