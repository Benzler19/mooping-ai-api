const db = require("../../configs/db.json")

const Task = function (task) {
    this.task = task.task
}

// สรุปรายรับ-รายจ่าย-กำไร ในช่วงวันที่ที่เลือก
Task.getSummary = async function (data, connection) {
    try {
        const sql = `
            SELECT
                COALESCE((
                    SELECT SUM(net_amount) FROM ${db["base"]}.tb_sale_order
                    WHERE status = 'paid' AND order_date BETWEEN ${connection.escape(data.date_from)} AND ${connection.escape(data.date_to)}
                ), 0) AS total_sale,
                COALESCE((
                    SELECT SUM(d.cost_subtotal)
                    FROM ${db["base"]}.tb_sale_order_detail AS d
                    JOIN ${db["base"]}.tb_sale_order AS o ON d.order_id = o.order_id
                    WHERE o.status = 'paid' AND o.order_date BETWEEN ${connection.escape(data.date_from)} AND ${connection.escape(data.date_to)}
                ), 0) AS total_cogs,
                COALESCE((
                    SELECT SUM(amount) FROM ${db["base"]}.tb_expense
                    WHERE expense_date BETWEEN ${connection.escape(data.date_from)} AND ${connection.escape(data.date_to)}
                ), 0) AS total_expense
        `
        const [res] = await connection.query(sql)
        const { total_sale, total_cogs, total_expense } = res[0]
        const gross_profit = Number(total_sale) - Number(total_cogs)
        const net_profit = gross_profit - Number(total_expense)
        return { data: { total_sale, total_cogs, total_expense, gross_profit, net_profit }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

// ยอดขายรายวัน สำหรับกราฟ
Task.getDailySales = async function (data, connection) {
    try {
        const sql = `
            SELECT o.order_date,
                   SUM(o.net_amount) AS total_sale,
                   COALESCE(SUM(d.cost_subtotal), 0) AS total_cogs
            FROM ${db["base"]}.tb_sale_order AS o
            LEFT JOIN ${db["base"]}.tb_sale_order_detail AS d ON d.order_id = o.order_id
            WHERE o.status = 'paid' AND o.order_date BETWEEN ${connection.escape(data.date_from)} AND ${connection.escape(data.date_to)}
            GROUP BY o.order_date
            ORDER BY o.order_date
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

// สินค้าขายดี
Task.getTopProducts = async function (data, connection) {
    try {
        const limit = Number(data.limit) || 10
        const sql = `
            SELECT p.product_id, p.product_name,
                   SUM(d.quantity) AS total_quantity,
                   SUM(d.subtotal) AS total_sale,
                   SUM(d.subtotal - d.cost_subtotal) AS total_profit
            FROM ${db["base"]}.tb_sale_order_detail AS d
            JOIN ${db["base"]}.tb_sale_order AS o ON d.order_id = o.order_id
            JOIN ${db["base"]}.tb_product AS p ON d.product_id = p.product_id
            WHERE o.status = 'paid' AND o.order_date BETWEEN ${connection.escape(data.date_from)} AND ${connection.escape(data.date_to)}
            GROUP BY p.product_id, p.product_name
            ORDER BY total_quantity DESC
            LIMIT ${connection.escape(limit)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
