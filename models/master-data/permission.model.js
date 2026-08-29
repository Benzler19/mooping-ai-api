const db = require("../../configs/db.json")
const { v4: uuidv4 } = require("uuid")
const saltRounds = 10
const Task = function (task) {
  this.task = task.task
  this.status = task.status
  this.created_at = new Date()
}

Task.insertPermission = function insertPermission(data, connection) {
  return new Promise((resolve, reject) => {
    let sql =''
    data.permissions.forEach(item => {
      sql += `
      INSERT INTO ${db["base"]}.tb_permission 
      (
        role_id, menu_id, permission_view, permission_manage)
        VALUES 
        (
          ${connection.escape(data.role_id)}, 
          ${connection.escape(item.menu_id)}, 
          ${connection.escape(item.permission_view)}, 
          ${connection.escape(item.permission_manage)}) as new 
          ON DUPLICATE KEY UPDATE 
          permission_view = new.permission_view,
          permission_manage = new.permission_manage;
          `
        })
        
    connection.query(sql, function (err, res) {
      if (err) {
        reject({ data: [], require: false, err: err })
      } else {
        resolve({ data: [], require: true })
      }
    })
  })
}

// Task.insertPermission = function insertPermission(data, connection) {
//   console.log('data :>> ', data);
//   return new Promise((resolve, reject) => {
//     let sql = '';
//     data.permissions.forEach(item => {
//       sql += `
//         INSERT INTO ${db["base"]}.tb_permission 
//         (role_id, menu_id, permission_view, permission_manage)
//         VALUES (
//           ${connection.escape(item.role_id)},   
//           ${connection.escape(item.menu_id)}, 
//           ${connection.escape(item.permission_view)}, 
//           ${connection.escape(item.permission_manage)}
//         ) AS new 
//         ON DUPLICATE KEY UPDATE 
//           permission_view = new.permission_view,
//           permission_manage = new.permission_manage;
//       `;
//     });
    
//     connection.query(sql, function (err, res) {
//       if (err) {
//         reject({ data: [], require: false, err: err })
//       } else {
//         resolve({ data: [], require: true })
//       }
//     })
//   })
// }


Task.getPermissionBy = function getPermissionBy(data, connection) {
  return new Promise((resolve, reject) => {
    let condition = ''
    let sql = `SELECT tb.menu_id,
    menu_group,
    menu_name,
    menu_name_en,
    IFNULL(permission_view, FALSE) AS permission_view,
    IFNULL(permission_manage, FALSE) AS permission_manage
    FROM ${db["base"]}.tb_menu AS tb
    LEFT JOIN ${db["base"]}.tb_permission AS tb_permission ON tb.menu_id = tb_permission.menu_id AND role_id = ${connection.escape(data.role_id || "")}
    WHERE 1
    ${condition}
    ORDER BY menu_group, tb.menu_id
    `
    connection.query(sql, function (err, res) {
      if (err) {
        reject({ data: "", require: false, err: err })
      } else {
        resolve({ data: res, require: true })
      }
    })
  })
}
Task.updatePermissionById = function updatePermissionBy(data, connection) {
  return new Promise((resolve, reject) => {
    let sql =''
    data.permissions.forEach(item => {
      sql += `
      DELETE 
      FROM ${db["base"]}.tb_permission 
      WHERE role_id = ${item.role_id} AND ${item.menu_id};
      `
      connection.query(sql, function (err, res) {
        if (err) {
          reject({ data: [], require: false, err: err })
        } else {
          resolve({ data: [], require: true })
        }
      })
    })
    data.permissions.forEach(item => {
      sql += `
      INSERT INTO ${db["base"]}.tb_permission 
      (
        role_id, menu_id, permission_view, permission_insert, permission_update,
        permission_delete
        )
        VALUES 
        (
          ${connection.escape(item.role_id)}, 
          ${connection.escape(item.menu_id)}, 
          ${connection.escape(item.permission_view)}, 
          ${connection.escape(item.permission_insert)}, 
          ${connection.escape(item.permission_update)}, 
          ${connection.escape(item.permission_delete)});`
        })
    connection.query(sql, function (err, res) {
      if (err) {
        reject({ data: [], require: false, err: err })
      } else {
        resolve({ data: [], require: true })
      }
    })
  })
}
Task.deletePermissionById = function deletePermissionById(data, connection) {
  return new Promise((resolve, reject) => {
      let sql = `
      DELETE 
      FROM ${db["base"]}.tb_permission 
      WHERE role_id = ${connection.escape(data.role_id)};`

      connection.query(sql, function (err, res) {
        if (err) {
          reject({ data: [], require: false, err: err })
        } else {
          resolve({ data: [], require: true })
        }
      })
    })
    
}

module.exports = Task
