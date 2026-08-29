const db = require("../../configs/db.json")

const Task = function (task) {
    this.task = task.task
}

Task.getIngredientBy = async function (data, connection) {
    try {
        const { filters, sorter, pagination, params } = connection.generatePageBy(data.params)
        const sql = `
            SELECT ingredient_id, ingredient_name, unit, current_stock, avg_cost, min_stock, status, create_date
            FROM ${db["base"]}.tb_ingredient
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        const [res] = await connection.query(sql, params)
        if (pagination === "") return { data: res, require: true }
        const [res_total] = await connection.query(`SELECT COUNT(*) AS total FROM ${db["base"]}.tb_ingredient WHERE ${filters}`, params)
        return { data: res, total: res_total[0].total, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.getIngredientById = async function (data, connection) {
    try {
        const sql = `SELECT * FROM ${db["base"]}.tb_ingredient WHERE ingredient_id = ${connection.escape(data.ingredient_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.getIngredientForRecipe = async function (data, connection) {
    try {
        const sql = `
            SELECT ingredient_id, ingredient_name, unit, avg_cost
            FROM ${db["base"]}.tb_ingredient
            WHERE status = 1
            ORDER BY ingredient_name
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.getLowStock = async function (data, connection) {
    try {
        const sql = `
            SELECT ingredient_id, ingredient_name, unit, current_stock, min_stock
            FROM ${db["base"]}.tb_ingredient
            WHERE status = 1 AND current_stock <= min_stock
            ORDER BY (current_stock - min_stock) ASC
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.insertIngredient = async function (data, connection) {
    try {
        const sql = `
            INSERT INTO ${db["base"]}.tb_ingredient SET
            ingredient_name = ${connection.escape(data.ingredient_name)},
            unit            = ${connection.escape(data.unit || "กก.")},
            current_stock   = ${connection.escape(data.current_stock || 0)},
            avg_cost        = ${connection.escape(data.avg_cost || 0)},
            min_stock       = ${connection.escape(data.min_stock || 0)},
            status          = 1,
            create_date     = NOW(),
            create_by       = ${connection.escape(data.create_by)}
        `
        const [res] = await connection.query(sql)
        return { data: { ingredient_id: res.insertId }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.updateIngredientById = async function (data, connection) {
    try {
        const sql = `
            UPDATE ${db["base"]}.tb_ingredient SET
            ingredient_name = ${connection.escape(data.ingredient_name)},
            unit            = ${connection.escape(data.unit)},
            min_stock       = ${connection.escape(data.min_stock)},
            status          = ${connection.escape(data.status)},
            update_date     = NOW(),
            update_by       = ${connection.escape(data.update_by)}
            WHERE ingredient_id = ${connection.escape(data.ingredient_id)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

// ปรับปรุงสต็อกด้วยมือ (นับสต็อกจริงแล้วไม่ตรง) -> ตั้งค่าใหม่ + log การเคลื่อนไหวเป็นส่วนต่าง
Task.adjustStock = async function (data, connection) {
    try {
        const [rows] = await connection.query(
            `SELECT current_stock FROM ${db["base"]}.tb_ingredient WHERE ingredient_id = ${connection.escape(data.ingredient_id)} FOR UPDATE`
        )
        if (rows.length === 0) throw { message: "ไม่พบวัตถุดิบ" }

        const before = Number(rows[0].current_stock)
        const after = Number(data.new_stock)
        const diff = after - before

        await connection.query(`
            UPDATE ${db["base"]}.tb_ingredient SET
            current_stock = ${connection.escape(after)},
            update_date   = NOW(),
            update_by     = ${connection.escape(data.create_by)}
            WHERE ingredient_id = ${connection.escape(data.ingredient_id)}
        `)

        await connection.query(`
            INSERT INTO ${db["base"]}.tb_stock_movement SET
            ingredient_id = ${connection.escape(data.ingredient_id)},
            movement_type = 'ADJUST',
            quantity      = ${connection.escape(Math.abs(diff))},
            ref_type      = 'adjust',
            ref_id        = NULL,
            balance_after = ${connection.escape(after)},
            note          = ${connection.escape(data.note || `ปรับสต็อกจาก ${before} เป็น ${after}`)},
            create_date   = NOW(),
            create_by     = ${connection.escape(data.create_by)}
        `)

        return { data: { current_stock: after }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.deleteIngredientById = async function (data, connection) {
    try {
        const sql = `DELETE FROM ${db["base"]}.tb_ingredient WHERE ingredient_id = ${connection.escape(data.ingredient_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
