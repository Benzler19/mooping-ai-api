const db = require("../../configs/db.json")
const { v4: uuidv4 } = require("uuid")

const Task = function (task) {
    this.task = task.task
}

const query = async (connection, sql) => {
    const [res] = await connection.query(sql)
    return res
}

Task.getSaleOrderBy = async function (data, connection) {
    try {
        const { filters, sorter, pagination, params } = connection.generatePageBy(data.params)
        const sql = `
            SELECT order_id, order_uuid, order_no, order_date, order_datetime,
                   total_amount, discount, net_amount, payment_method, status
            FROM ${db["base"]}.tb_sale_order
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        const [res] = await connection.query(sql, params)
        if (pagination === "") return { data: res, require: true }
        const [res_total] = await connection.query(`SELECT COUNT(*) AS total FROM ${db["base"]}.tb_sale_order WHERE ${filters}`, params)
        return { data: res, total: res_total[0].total, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.getSaleOrderById = async function (data, connection) {
    try {
        const sql = `SELECT * FROM ${db["base"]}.tb_sale_order WHERE order_id = ${connection.escape(data.order_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.getSaleOrderDetailByOrder = async function (data, connection) {
    try {
        const sql = `
            SELECT tb1.detail_id, tb1.product_id, tb1.quantity, tb1.unit_price, tb1.unit_cost, tb1.subtotal, tb1.cost_subtotal,
                   tb2.product_name, tb2.unit
            FROM ${db["base"]}.tb_sale_order_detail AS tb1
            LEFT JOIN ${db["base"]}.tb_product AS tb2 ON tb1.product_id = tb2.product_id
            WHERE tb1.order_id = ${connection.escape(data.order_id)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

// บันทึกบิลขาย -> คำนวณต้นทุนจากสูตร ณ ปัจจุบัน + ตัดสต็อกวัตถุดิบอัตโนมัติ
Task.insertSaleOrder = async function (data, connection) {
    try {
        const items = data.items || []
        if (items.length === 0) throw { message: "ไม่มีรายการสินค้า" }

        const order_date = data.order_date
        const [{ cnt }] = await query(connection, `
            SELECT COUNT(*) AS cnt FROM ${db["base"]}.tb_sale_order WHERE order_date = ${connection.escape(order_date)}
        `)
        const order_no = `${order_date.replace(/-/g, "")}-${String(cnt + 1).padStart(4, "0")}`
        const order_uuid = uuidv4()

        let total_amount = 0
        const detailRows = []
        for (const item of items) {
            const quantity = Number(item.quantity)
            const unit_price = Number(item.unit_price)

            const recipe = await query(connection, `
                SELECT r.ingredient_id, r.quantity_used, i.avg_cost
                FROM ${db["base"]}.tb_recipe AS r
                JOIN ${db["base"]}.tb_ingredient AS i ON r.ingredient_id = i.ingredient_id
                WHERE r.product_id = ${connection.escape(item.product_id)}
            `)
            const unit_cost = recipe.reduce((sum, r) => sum + Number(r.quantity_used) * Number(r.avg_cost), 0)

            const subtotal = quantity * unit_price
            const cost_subtotal = quantity * unit_cost
            total_amount += subtotal

            detailRows.push({ product_id: item.product_id, quantity, unit_price, unit_cost, subtotal, cost_subtotal, recipe })
        }

        const discount = Number(data.discount || 0)
        const net_amount = total_amount - discount

        const header = await query(connection, `
            INSERT INTO ${db["base"]}.tb_sale_order SET
            order_uuid     = ${connection.escape(order_uuid)},
            order_no       = ${connection.escape(order_no)},
            order_date     = ${connection.escape(order_date)},
            order_datetime = NOW(),
            total_amount   = ${connection.escape(total_amount)},
            discount       = ${connection.escape(discount)},
            net_amount     = ${connection.escape(net_amount)},
            payment_method = ${connection.escape(data.payment_method || "cash")},
            status         = 'paid',
            note           = ${connection.escape(data.note || null)},
            create_date    = NOW(),
            create_by      = ${connection.escape(data.create_by)}
        `)
        const order_id = header.insertId

        for (const row of detailRows) {
            await query(connection, `
                INSERT INTO ${db["base"]}.tb_sale_order_detail SET
                order_id      = ${connection.escape(order_id)},
                product_id    = ${connection.escape(row.product_id)},
                quantity      = ${connection.escape(row.quantity)},
                unit_price    = ${connection.escape(row.unit_price)},
                unit_cost     = ${connection.escape(row.unit_cost)},
                subtotal      = ${connection.escape(row.subtotal)},
                cost_subtotal = ${connection.escape(row.cost_subtotal)}
            `)

            for (const ingredient of row.recipe) {
                const useQty = Number(ingredient.quantity_used) * row.quantity

                const [stock] = await query(connection, `
                    SELECT current_stock FROM ${db["base"]}.tb_ingredient
                    WHERE ingredient_id = ${connection.escape(ingredient.ingredient_id)} FOR UPDATE
                `)
                const newStock = Number(stock.current_stock) - useQty

                await query(connection, `
                    UPDATE ${db["base"]}.tb_ingredient SET current_stock = ${connection.escape(newStock)}
                    WHERE ingredient_id = ${connection.escape(ingredient.ingredient_id)}
                `)

                await query(connection, `
                    INSERT INTO ${db["base"]}.tb_stock_movement SET
                    ingredient_id = ${connection.escape(ingredient.ingredient_id)},
                    movement_type = 'OUT',
                    quantity      = ${connection.escape(useQty)},
                    ref_type      = 'sale',
                    ref_id        = ${connection.escape(order_id)},
                    balance_after = ${connection.escape(newStock)},
                    create_date   = NOW(),
                    create_by     = ${connection.escape(data.create_by)}
                `)
            }
        }

        return { data: { order_id, order_uuid, order_no }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

// ยกเลิกบิล -> คืนสต็อกวัตถุดิบทั้งหมดกลับ
Task.cancelSaleOrder = async function (data, connection) {
    try {
        const details = await query(connection, `
            SELECT product_id, quantity FROM ${db["base"]}.tb_sale_order_detail WHERE order_id = ${connection.escape(data.order_id)}
        `)

        for (const detail of details) {
            const recipe = await query(connection, `
                SELECT ingredient_id, quantity_used FROM ${db["base"]}.tb_recipe WHERE product_id = ${connection.escape(detail.product_id)}
            `)
            for (const ingredient of recipe) {
                const returnQty = Number(ingredient.quantity_used) * Number(detail.quantity)

                const [stock] = await query(connection, `
                    SELECT current_stock FROM ${db["base"]}.tb_ingredient
                    WHERE ingredient_id = ${connection.escape(ingredient.ingredient_id)} FOR UPDATE
                `)
                const newStock = Number(stock.current_stock) + returnQty

                await query(connection, `
                    UPDATE ${db["base"]}.tb_ingredient SET current_stock = ${connection.escape(newStock)}
                    WHERE ingredient_id = ${connection.escape(ingredient.ingredient_id)}
                `)

                await query(connection, `
                    INSERT INTO ${db["base"]}.tb_stock_movement SET
                    ingredient_id = ${connection.escape(ingredient.ingredient_id)},
                    movement_type = 'IN',
                    quantity      = ${connection.escape(returnQty)},
                    ref_type      = 'sale_cancel',
                    ref_id        = ${connection.escape(data.order_id)},
                    balance_after = ${connection.escape(newStock)},
                    note          = 'คืนสต็อกจากการยกเลิกบิล',
                    create_date   = NOW(),
                    create_by     = ${connection.escape(data.create_by)}
                `)
            }
        }

        await query(connection, `
            UPDATE ${db["base"]}.tb_sale_order SET status = 'cancelled' WHERE order_id = ${connection.escape(data.order_id)}
        `)

        return { data: [], require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
