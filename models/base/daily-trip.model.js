const db = require("../../configs/db.json")
const { v4: uuidv4 } = require("uuid")

const Task = function (task) {
    this.task = task.task
}

Task.getTripBy = function (data, connection) {
    return new Promise((resolve, reject) => {
        const { filters, sorter, pagination } = connection.generatePageBy(data.params)
        let sql = `
            SELECT
                tb1.trip_id, tb1.trip_uuid, tb1.trip_date, tb1.status,
                tb1.fuel_cost, tb1.repair_cost, tb1.repair_note,
                tb1.head_fee, tb1.allowance, tb1.other_expense, tb1.other_expense_note,
                tb1.house_money, tb1.house_money_remain, tb1.savings_remain,
                tb1.money_paid_out, tb1.money_saved,
                tb1.create_date, tb1.create_by,
                tb1.submit_date, tb1.submit_by,
                tb1.verified_date, tb1.verified_by,
                tb2.route_code, tb2.route_name
            FROM ${db["base"]}.tb_daily_trip AS tb1
            LEFT JOIN ${db["base"]}.tb_route AS tb2 ON tb1.route_id = tb2.route_id
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            if (pagination === "") return resolve({ data: res, require: true })
            sql = `SELECT COUNT(*) AS total FROM ${db["base"]}.tb_daily_trip WHERE ${filters}`
            connection.query(sql, (err, res_total) => {
                if (err) return reject({ data: [], require: false, err })
                resolve({ data: res, total: res_total[0].total, require: true })
            })
        })
    })
}

Task.getTripById = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT tb1.*, tb2.route_code, tb2.route_name
            FROM ${db["base"]}.tb_daily_trip AS tb1
            LEFT JOIN ${db["base"]}.tb_route AS tb2 ON tb1.route_id = tb2.route_id
            WHERE tb1.trip_id = ${connection.escape(data.trip_id)}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

Task.insertTrip = function (data, connection) {
    return new Promise((resolve, reject) => {
        const trip_uuid = uuidv4()
        const sql = `
            INSERT INTO ${db["base"]}.tb_daily_trip SET
            trip_uuid           = ${connection.escape(trip_uuid)},
            route_id            = ${connection.escape(data.route_id)},
            trip_date           = ${connection.escape(data.trip_date)},
            fuel_cost           = ${connection.escape(data.fuel_cost || 0)},
            repair_cost         = ${connection.escape(data.repair_cost || 0)},
            repair_note         = ${connection.escape(data.repair_note || null)},
            head_fee            = ${connection.escape(data.head_fee || 0)},
            allowance           = ${connection.escape(data.allowance || 0)},
            other_expense       = ${connection.escape(data.other_expense || 0)},
            other_expense_note  = ${connection.escape(data.other_expense_note || null)},
            house_money         = ${connection.escape(data.house_money || 0)},
            house_money_remain  = ${connection.escape(data.house_money_remain || 0)},
            savings_remain      = ${connection.escape(data.savings_remain || 0)},
            money_paid_out      = ${connection.escape(data.money_paid_out || 0)},
            money_saved         = ${connection.escape(data.money_saved || 0)},
            status              = 'draft',
            create_date         = NOW(),
            create_by           = ${connection.escape(data.create_by)}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: { trip_id: res.insertId, trip_uuid }, require: true })
        })
    })
}

Task.updateTripById = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE ${db["base"]}.tb_daily_trip SET
            fuel_cost           = ${connection.escape(data.fuel_cost)},
            repair_cost         = ${connection.escape(data.repair_cost)},
            repair_note         = ${connection.escape(data.repair_note)},
            head_fee            = ${connection.escape(data.head_fee)},
            allowance           = ${connection.escape(data.allowance)},
            other_expense       = ${connection.escape(data.other_expense)},
            other_expense_note  = ${connection.escape(data.other_expense_note)},
            house_money         = ${connection.escape(data.house_money)},
            house_money_remain  = ${connection.escape(data.house_money_remain)},
            savings_remain      = ${connection.escape(data.savings_remain)},
            money_paid_out      = ${connection.escape(data.money_paid_out)},
            money_saved         = ${connection.escape(data.money_saved)},
            update_date         = NOW(),
            update_by           = ${connection.escape(data.update_by)}
            WHERE trip_id = ${connection.escape(data.trip_id)}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

Task.submitTrip = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE ${db["base"]}.tb_daily_trip SET
            status      = 'submitted',
            submit_date = NOW(),
            submit_by   = ${connection.escape(data.submit_by)},
            update_date = NOW(),
            update_by   = ${connection.escape(data.submit_by)}
            WHERE trip_id = ${connection.escape(data.trip_id)}
            AND status = 'draft'
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

Task.verifyTrip = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE ${db["base"]}.tb_daily_trip SET
            status        = 'verified',
            verified_date = NOW(),
            verified_by   = ${connection.escape(data.verified_by)},
            update_date   = NOW(),
            update_by     = ${connection.escape(data.verified_by)}
            WHERE trip_id = ${connection.escape(data.trip_id)}
            AND status = 'submitted'
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

Task.deleteTripById = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ${db["base"]}.tb_daily_trip WHERE trip_id = ${connection.escape(data.trip_id)}`
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

module.exports = Task
