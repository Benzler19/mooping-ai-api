const db = require("../../configs/db.json")

const Task = function (task) {
    this.task = task.task
}

Task.getCollectionByTrip = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                tb1.detail_id, tb1.trip_id, tb1.borrower_id,
                tb1.outstanding_before, tb1.outstanding_after,
                tb1.installment_amount, tb1.collected_amount, tb1.shortage_amount,
                tb1.missed_count_snapshot, tb1.is_cut, tb1.note,
                tb1.create_date, tb1.create_by, tb1.update_date, tb1.update_by,
                tb2.name AS borrower_name, tb2.location, tb2.seq_no
            FROM ${db["base"]}.tb_collection_detail AS tb1
            LEFT JOIN ${db["base"]}.tb_borrower AS tb2 ON tb1.borrower_id = tb2.borrower_id
            WHERE tb1.trip_id = ${connection.escape(data.trip_id)}
            ORDER BY tb2.seq_no ASC
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

Task.saveCollection = function (data, connection) {
    return new Promise((resolve, reject) => {
        const outstanding_after = data.outstanding_before - data.collected_amount
        const sql = `
            INSERT INTO ${db["base"]}.tb_collection_detail SET
            trip_id               = ${connection.escape(data.trip_id)},
            borrower_id           = ${connection.escape(data.borrower_id)},
            outstanding_before    = ${connection.escape(data.outstanding_before)},
            outstanding_after     = ${connection.escape(outstanding_after)},
            installment_amount    = ${connection.escape(data.installment_amount)},
            collected_amount      = ${connection.escape(data.collected_amount)},
            missed_count_snapshot = ${connection.escape(data.missed_count_snapshot)},
            is_cut                = ${connection.escape(data.is_cut || 0)},
            note                  = ${connection.escape(data.note || null)},
            create_date           = NOW(),
            create_by             = ${connection.escape(data.create_by)}
            ON DUPLICATE KEY UPDATE
            outstanding_before    = ${connection.escape(data.outstanding_before)},
            outstanding_after     = ${connection.escape(outstanding_after)},
            installment_amount    = ${connection.escape(data.installment_amount)},
            collected_amount      = ${connection.escape(data.collected_amount)},
            missed_count_snapshot = ${connection.escape(data.missed_count_snapshot)},
            is_cut                = ${connection.escape(data.is_cut || 0)},
            note                  = ${connection.escape(data.note || null)},
            update_date           = NOW(),
            update_by             = ${connection.escape(data.create_by)}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: { detail_id: res.insertId }, require: true })
        })
    })
}

Task.deleteCollectionByTrip = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ${db["base"]}.tb_collection_detail WHERE trip_id = ${connection.escape(data.trip_id)}`
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

module.exports = Task
