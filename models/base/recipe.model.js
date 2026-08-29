const db = require("../../configs/db.json")

const Task = function (task) {
    this.task = task.task
}

Task.getRecipeByProduct = async function (data, connection) {
    try {
        const sql = `
            SELECT tb1.recipe_id, tb1.product_id, tb1.ingredient_id, tb1.quantity_used,
                   tb2.ingredient_name, tb2.unit, tb2.avg_cost
            FROM ${db["base"]}.tb_recipe AS tb1
            LEFT JOIN ${db["base"]}.tb_ingredient AS tb2 ON tb1.ingredient_id = tb2.ingredient_id
            WHERE tb1.product_id = ${connection.escape(data.product_id)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

// บันทึกสูตรทั้งชุดของสินค้า 1 ตัว (ลบของเดิมแล้วใส่ใหม่ทั้งหมด)
Task.saveRecipe = async function (data, connection) {
    try {
        await connection.query(`DELETE FROM ${db["base"]}.tb_recipe WHERE product_id = ${connection.escape(data.product_id)}`)

        const items = data.items || []
        if (items.length === 0) return { data: [], require: true }

        const values = items.map((item) => `(
            ${connection.escape(data.product_id)},
            ${connection.escape(item.ingredient_id)},
            ${connection.escape(item.quantity_used)}
        )`).join(",")

        const [res] = await connection.query(`INSERT INTO ${db["base"]}.tb_recipe (product_id, ingredient_id, quantity_used) VALUES ${values}`)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
