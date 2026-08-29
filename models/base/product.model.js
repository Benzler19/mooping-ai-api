const db = require("../../configs/db.json")
const { v4: uuidv4 } = require("uuid")

const Task = function (task) {
    this.task = task.task
}

Task.getProductBy = async function (data, connection) {
    try {
        const { filters, sorter, pagination, params } = connection.generatePageBy(data.params)
        const sql = `
            SELECT
                tb1.product_id, tb1.product_uuid, tb1.category_id, tb1.product_name,
                tb1.unit, tb1.sale_price, tb1.status, tb1.create_date,
                tb2.category_name
            FROM ${db["base"]}.tb_product AS tb1
            LEFT JOIN ${db["base"]}.tb_category AS tb2 ON tb1.category_id = tb2.category_id
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        const [res] = await connection.query(sql, params)
        if (pagination === "") return { data: res, require: true }
        const [res_total] = await connection.query(`SELECT COUNT(*) AS total FROM ${db["base"]}.tb_product AS tb1 WHERE ${filters}`, params)
        return { data: res, total: res_total[0].total, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.getProductById = async function (data, connection) {
    try {
        const sql = `
            SELECT tb1.*, tb2.category_name
            FROM ${db["base"]}.tb_product AS tb1
            LEFT JOIN ${db["base"]}.tb_category AS tb2 ON tb1.category_id = tb2.category_id
            WHERE tb1.product_id = ${connection.escape(data.product_id)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

// สำหรับหน้าขาย (POS) เอาเฉพาะสินค้าที่ยังขายอยู่ พร้อมต้นทุน/หน่วยที่คำนวณจากสูตร ณ ปัจจุบัน
Task.getProductForSale = async function (data, connection) {
    try {
        const sql = `
            SELECT
                tb1.product_id, tb1.product_name, tb1.unit, tb1.sale_price, tb1.category_id,
                tb2.category_name,
                COALESCE((
                    SELECT SUM(r.quantity_used * i.avg_cost)
                    FROM ${db["base"]}.tb_recipe AS r
                    JOIN ${db["base"]}.tb_ingredient AS i ON r.ingredient_id = i.ingredient_id
                    WHERE r.product_id = tb1.product_id
                ), 0) AS unit_cost
            FROM ${db["base"]}.tb_product AS tb1
            LEFT JOIN ${db["base"]}.tb_category AS tb2 ON tb1.category_id = tb2.category_id
            WHERE tb1.status = 1
            ORDER BY tb2.category_name, tb1.product_name
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.insertProduct = async function (data, connection) {
    try {
        const product_uuid = uuidv4()
        const sql = `
            INSERT INTO ${db["base"]}.tb_product SET
            product_uuid = ${connection.escape(product_uuid)},
            category_id  = ${connection.escape(data.category_id)},
            product_name = ${connection.escape(data.product_name)},
            unit         = ${connection.escape(data.unit || "ไม้")},
            sale_price   = ${connection.escape(data.sale_price || 0)},
            status       = 1,
            create_date  = NOW(),
            create_by    = ${connection.escape(data.create_by)}
        `
        const [res] = await connection.query(sql)
        return { data: { product_id: res.insertId, product_uuid }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.updateProductById = async function (data, connection) {
    try {
        const sql = `
            UPDATE ${db["base"]}.tb_product SET
            category_id  = ${connection.escape(data.category_id)},
            product_name = ${connection.escape(data.product_name)},
            unit         = ${connection.escape(data.unit)},
            sale_price   = ${connection.escape(data.sale_price)},
            status       = ${connection.escape(data.status)},
            update_date  = NOW(),
            update_by    = ${connection.escape(data.update_by)}
            WHERE product_id = ${connection.escape(data.product_id)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.deleteProductById = async function (data, connection) {
    try {
        const sql = `DELETE FROM ${db["base"]}.tb_product WHERE product_id = ${connection.escape(data.product_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
