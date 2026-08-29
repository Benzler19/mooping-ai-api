const db = require("../../configs/db.json")
const Task = function (task) {
  this.task = task.task
  this.status = task.status
  this.created_at = new Date()
}
Task.getRoleBy = function getRoleBy(data, connection) {
  return new Promise((resolve, reject) => {
    const { filters, sorter, pagination } = connection.generatePageBy(data.params)
    let sql = `SELECT role_id,role_name 
                FROM ${db["base"]}.tb_role AS tb1 
                `
    connection.query(sql, (err, res) => {
      if (err) {
        reject({ data: [], require: false, err: err })
      } else {
        if (pagination === "") {
          resolve({ data: res, require: true })
        } else {
          sql = `SELECT COUNT (*) AS total FROM tb_role WHERE ${filters}`
          connection.query(sql, function (err, res_total) {
            if (err) {
              reject({ data: [], require: false, err: err })
            } else {
              resolve({ data: res, total: res_total[0].total, require: true })
            }
          })
        }
      }
    })
  })
}

Task.getRoleById = function getRoleById(data, connection) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT *
    FROM ${db["base"]}.tb_role AS tb 
    WHERE role_id = ${connection.escape(data.role_id)}`
    connection.query(sql, (err, res) => {
      if (err) {
        reject({ data: [], require: false, err: err })
      } else {
        resolve({ data: res, require: true })
      }
    })
  })
}

Task.insertRole = function insertRole(data, connection) {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO ${db["base"]}.tb_role (role_id,role_name)
                VALUES(${connection.escape(data.role_id)},${connection.escape(data.role_name)})as new
                ON DUPLICATE KEY UPDATE 
                role_name = new.role_name;
            `
    connection.query(sql, (err, res) => {
      if (err) {
        reject({ data: [], require: false, err: err })
      } else {
        resolve({ data: { role_id: res.insertId }, require: true })
      }
    })
  })
}

Task.updateRoleById = function updateRoleById(data, connection) {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE ${db["base"]}.tb_role SET 
        role_name = ${connection.escape(data.role_name)}
        WHERE role_id = ${connection.escape(data.role_id)}`
    connection.query(sql, (err, res) => {
      if (err) {
        reject({ data: [], require: false, err: err })
      } else {
        resolve({ data: res, require: true })
      }
    })
  })
}

Task.deleteRoleById = function deleteRoleById(data, connection) {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM ${db["base"]}.tb_role WHERE role_id = '${data.role_id}'`
    connection.query(sql, (err, res) => {
      if (err) {
        reject({ data: [], require: false, err: err })
      } else {
        resolve({ data: res, require: true })
      }
    })
  })
}

module.exports = Task
