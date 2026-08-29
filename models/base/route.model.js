const db = require("../../configs/db.json")

const Task = function (task) {
    this.task = task.task
}

Task.getRouteBy = function (data, connection) {
    return new Promise((resolve, reject) => {
        const { filters, sorter, pagination } = connection.generatePageBy(data.params)
        let sql = `
            SELECT route_id, route_code, route_name, is_active
            FROM ${db["base"]}.tb_route
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            if (pagination === "") return resolve({ data: res, require: true })
            sql = `SELECT COUNT(*) AS total FROM ${db["base"]}.tb_route WHERE ${filters}`
            connection.query(sql, (err, res_total) => {
                if (err) return reject({ data: [], require: false, err })
                resolve({ data: res, total: res_total[0].total, require: true })
            })
        })
    })
}

Task.getRouteById = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM ${db["base"]}.tb_route
            WHERE route_id = ${connection.escape(data.route_id)}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

Task.insertRoute = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO ${db["base"]}.tb_route SET
            route_code  = ${connection.escape(data.route_code)},
            route_name  = ${connection.escape(data.route_name)},
            is_active   = 1,
            create_date = NOW(),
            create_by   = ${connection.escape(data.create_by)}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: { route_id: res.insertId }, require: true })
        })
    })
}

Task.updateRouteById = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE ${db["base"]}.tb_route SET
            route_code  = ${connection.escape(data.route_code)},
            route_name  = ${connection.escape(data.route_name)},
            is_active   = ${connection.escape(data.is_active)},
            update_date = NOW(),
            update_by   = ${connection.escape(data.update_by)}
            WHERE route_id = ${connection.escape(data.route_id)}
        `
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

Task.deleteRouteById = function (data, connection) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ${db["base"]}.tb_route WHERE route_id = ${connection.escape(data.route_id)}`
        connection.query(sql, (err, res) => {
            if (err) return reject({ data: [], require: false, err })
            resolve({ data: res, require: true })
        })
    })
}

module.exports = Task
