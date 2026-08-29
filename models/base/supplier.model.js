const db = require("../../configs/db.json")

const Task = function (task) {
    this.task = task.task
}

Task.getSupplierBy = async function (data, connection) {
    try {
        const { filters, sorter, pagination, params } = connection.generatePageBy(data.params)
        const sql = `
            SELECT supplier_id, supplier_name, phone, address, status
            FROM ${db["base"]}.tb_supplier
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        const [res] = await connection.query(sql, params)
        if (pagination === "") return { data: res, require: true }
        const [res_total] = await connection.query(`SELECT COUNT(*) AS total FROM ${db["base"]}.tb_supplier WHERE ${filters}`, params)
        return { data: res, total: res_total[0].total, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.insertSupplier = async function (data, connection) {
    try {
        const sql = `
            INSERT INTO ${db["base"]}.tb_supplier SET
            supplier_name = ${connection.escape(data.supplier_name)},
            phone         = ${connection.escape(data.phone || null)},
            address       = ${connection.escape(data.address || null)},
            status        = 1
        `
        const [res] = await connection.query(sql)
        return { data: { supplier_id: res.insertId }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.updateSupplierById = async function (data, connection) {
    try {
        const sql = `
            UPDATE ${db["base"]}.tb_supplier SET
            supplier_name = ${connection.escape(data.supplier_name)},
            phone         = ${connection.escape(data.phone)},
            address       = ${connection.escape(data.address)},
            status        = ${connection.escape(data.status)}
            WHERE supplier_id = ${connection.escape(data.supplier_id)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.deleteSupplierById = async function (data, connection) {
    try {
        const sql = `DELETE FROM ${db["base"]}.tb_supplier WHERE supplier_id = ${connection.escape(data.supplier_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
