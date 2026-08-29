const db = require("../../configs/db.json")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")
const saltRounds = 10

const Task = function (task) {
    this.task = task.task
}

Task.getUserBy = async function (data, connection) {
    try {
        const { filters, sorter, pagination, params } = connection.generatePageBy(data.params)
        const sql = `
            SELECT user_id, user_uuid, username, full_name, status, create_date
            FROM ${db["base"]}.tb_user
            WHERE ${filters}
            ${sorter}
            ${pagination}
        `
        const [res] = await connection.query(sql, params)
        if (pagination === "") return { data: res, require: true }
        const [res_total] = await connection.query(`SELECT COUNT(*) AS total FROM ${db["base"]}.tb_user WHERE ${filters}`, params)
        return { data: res, total: res_total[0].total, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.getUserById = async function (data, connection) {
    try {
        const sql = `SELECT user_id, user_uuid, username, full_name, status FROM ${db["base"]}.tb_user WHERE user_id = ${connection.escape(data.user_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.insertUser = async function (data, connection) {
    try {
        const user_uuid = uuidv4()
        const hashedPassword = await bcrypt.hash(data.password, saltRounds)
        const sql = `
            INSERT INTO ${db["base"]}.tb_user SET
            user_uuid   = ${connection.escape(user_uuid)},
            username    = ${connection.escape(data.username)},
            password    = ${connection.escape(hashedPassword)},
            full_name   = ${connection.escape(data.full_name)},
            status      = 1,
            create_date = NOW(),
            create_by   = ${connection.escape(data.create_by)}
        `
        const [res] = await connection.query(sql)
        return { data: { user_id: res.insertId, user_uuid }, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.checkLogin = async function (data, connection) {
    try {
        const sql = `SELECT * FROM ${db["base"]}.tb_user WHERE username = ${connection.escape(data.username)} AND status = 1`
        const [res] = await connection.query(sql)
        if (res.length === 0) return { data: [], require: false, err: "ไม่พบผู้ใช้งาน" }
        const match = await bcrypt.compare(data.password, res[0].password)
        if (!match) return { data: [], require: false, err: "รหัสผ่านไม่ถูกต้อง" }
        res[0].password = undefined
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.updateUserById = async function (data, connection) {
    try {
        let str_repass = ""
        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, saltRounds)
            str_repass = `password = ${connection.escape(hashedPassword)},`
        }
        const sql = `
            UPDATE ${db["base"]}.tb_user SET
            username    = ${connection.escape(data.username)},
            ${str_repass}
            full_name   = ${connection.escape(data.full_name)},
            status      = ${connection.escape(data.status)},
            update_date = NOW(),
            update_by   = ${connection.escape(data.update_by)}
            WHERE user_id = ${connection.escape(data.user_id)}
        `
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

Task.deleteUserById = async function (data, connection) {
    try {
        const sql = `DELETE FROM ${db["base"]}.tb_user WHERE user_id = ${connection.escape(data.user_id)}`
        const [res] = await connection.query(sql)
        return { data: res, require: true }
    } catch (err) {
        throw { data: [], require: false, err }
    }
}

module.exports = Task
