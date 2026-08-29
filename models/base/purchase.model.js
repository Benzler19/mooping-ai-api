const db = require("../../configs/db.json")
const { v4: uuidv4 } = require("uuid")

const Task = function (task) {
    this.task = task.task
}

const query = async (connection, sql) => {
    const [res] = await connection.query(sql)
    return res
}

Task.getPurchaseBy = async function (data, connection) {
    try {
        const { filters, sorter, pagination, params } = connection.generatePageBy(data.params)
        const sql = `
            SELECT tb1.purchase_id, tb1.purchase_uuid, tb1.purchase_date, tb1.total_amount, tb1.note, tb1.create_date,
                   tb2.supplier_name
            FROM ${db["base"]}.tb_purchase AS tb1
            LEFT JOIN ${db["base"]}.tb_supplier AS tb2 ON tb1.supplier_id = tb2.supplier_id
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        const [res] = await connection.query(sql, params)
        if (pagination === "") return { data: res, require: true }
        const [res_total] = await connection.query(`SELECT COUNT(*) AS total FROM ${db["base"]}.tb_purchase AS tb1 WHERE ${filters}`, params)
        return { data: res, total: res_total[0].total, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.getPurchaseById = async function (data, connection) {
    try {
        const sql = `
            SELECT tb1.detail_id, tb1.ingredient_id, tb1.quantity, tb1.unit_cost, tb1.subtotal, tb2.ingredient_name, tb2.unit
            FROM ${db["base"]}.tb_purchase_detail AS tb1
            LEFT JOIN ${db["base"]}.tb_ingredient AS tb2 ON tb1.ingredient_id = tb2.ingredient_id
            WHERE tb1.purchase_id = ${connection.escape(data.purchase_id)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

// บันทึกบิลซื้อวัตถุดิบเข้า -> เพิ่มสต็อก + คำนวณต้นทุนเฉลี่ยถ่วงน้ำหนัก (moving average) + log การเคลื่อนไหว
Task.insertPurchase = async function (data, connection) {
    try {
        const items = data.items || []
        if (items.length === 0) throw { message: "ไม่มีรายการวัตถุดิบ" }

        const total_amount = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_cost), 0)
        const purchase_uuid = uuidv4()

        const header = await query(connection, `
            INSERT INTO ${db["base"]}.tb_purchase SET
            purchase_uuid = ${connection.escape(purchase_uuid)},
            purchase_date = ${connection.escape(data.purchase_date)},
            supplier_id   = ${connection.escape(data.supplier_id || null)},
            total_amount  = ${connection.escape(total_amount)},
            note          = ${connection.escape(data.note || null)},
            create_date   = NOW(),
            create_by     = ${connection.escape(data.create_by)}
        `)
        const purchase_id = header.insertId

        for (const item of items) {
            const quantity = Number(item.quantity)
            const unit_cost = Number(item.unit_cost)
            const subtotal = quantity * unit_cost

            await query(connection, `
                INSERT INTO ${db["base"]}.tb_purchase_detail SET
                purchase_id   = ${connection.escape(purchase_id)},
                ingredient_id = ${connection.escape(item.ingredient_id)},
                quantity      = ${connection.escape(quantity)},
                unit_cost     = ${connection.escape(unit_cost)},
                subtotal      = ${connection.escape(subtotal)}
            `)

            const [ingredient] = await query(connection, `
                SELECT current_stock, avg_cost FROM ${db["base"]}.tb_ingredient
                WHERE ingredient_id = ${connection.escape(item.ingredient_id)} FOR UPDATE
            `)
            if (!ingredient) throw { message: `ไม่พบวัตถุดิบ id ${item.ingredient_id}` }

            const oldStock = Number(ingredient.current_stock)
            const oldAvgCost = Number(ingredient.avg_cost)
            const newStock = oldStock + quantity
            const newAvgCost = newStock === 0 ? 0 : ((oldStock * oldAvgCost) + (quantity * unit_cost)) / newStock

            await query(connection, `
                UPDATE ${db["base"]}.tb_ingredient SET
                current_stock = ${connection.escape(newStock)},
                avg_cost      = ${connection.escape(newAvgCost)},
                update_date   = NOW(),
                update_by     = ${connection.escape(data.create_by)}
                WHERE ingredient_id = ${connection.escape(item.ingredient_id)}
            `)

            await query(connection, `
                INSERT INTO ${db["base"]}.tb_stock_movement SET
                ingredient_id = ${connection.escape(item.ingredient_id)},
                movement_type = 'IN',
                quantity      = ${connection.escape(quantity)},
                ref_type      = 'purchase',
                ref_id        = ${connection.escape(purchase_id)},
                balance_after = ${connection.escape(newStock)},
                create_date   = NOW(),
                create_by     = ${connection.escape(data.create_by)}
            `)
        }

        return { data: { purchase_id, purchase_uuid }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.deletePurchaseById = async function (data, connection) {
    try {
        const sql = `DELETE FROM ${db["base"]}.tb_purchase WHERE purchase_id = ${connection.escape(data.purchase_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
