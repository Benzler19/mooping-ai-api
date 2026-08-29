const db = require("../../configs/db.json")

const Task = function (task) {
    this.task = task.task
}

Task.getCategoryBy = async function (data, connection) {
    try {
        const { filters, sorter, pagination, params } = connection.generatePageBy(data.params)
        const sql = `
            SELECT category_id, category_name, status, create_date
            FROM ${db["base"]}.tb_category
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        const [res] = await connection.query(sql, params)
        if (pagination === "") return { data: res, require: true }
        const [res_total] = await connection.query(`SELECT COUNT(*) AS total FROM ${db["base"]}.tb_category WHERE ${filters}`, params)
        return { data: res, total: res_total[0].total, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.getCategoryById = async function (data, connection) {
    try {
        const sql = `SELECT * FROM ${db["base"]}.tb_category WHERE category_id = ${connection.escape(data.category_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.insertCategory = async function (data, connection) {
    try {
        const sql = `
            INSERT INTO ${db["base"]}.tb_category SET
            category_name = ${connection.escape(data.category_name)},
            status        = 1,
            create_date   = NOW(),
            create_by     = ${connection.escape(data.create_by)}
        `
        const [res] = await connection.query(sql)
        return { data: { category_id: res.insertId }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.updateCategoryById = async function (data, connection) {
    try {
        const sql = `
            UPDATE ${db["base"]}.tb_category SET
            category_name = ${connection.escape(data.category_name)},
            status        = ${connection.escape(data.status)}
            WHERE category_id = ${connection.escape(data.category_id)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.deleteCategoryById = async function (data, connection) {
    try {
        const sql = `DELETE FROM ${db["base"]}.tb_category WHERE category_id = ${connection.escape(data.category_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
