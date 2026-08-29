// models/base/school.model.js
const db = require("../../configs/db.json");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;
const bcrypt = require("bcrypt");

const Task = function (task) {
  this.task = task.task;
  this.status = task.status;
  this.created_at = new Date();
};

Task.getUserBy = function getUserBy(data, connection) {
  return new Promise((resolve, reject) => {
    const { filters, sorter, pagination } = connection.generatePageBy(data.params);
    let sql = `
        SELECT 
        tb1.user_table_uuid,
        tb1.username,
        tb1.firstname,
        tb1.lastname,
        tb1.is_active,
        tb2.role_name
        FROM ${db["base"]}.tb_user AS tb1
        LEFT JOIN ${db["base"]}.tb_role AS tb2 ON tb1.role_id = tb2.role_id
        WHERE 
         ${filters}
        ${sorter}
        ${pagination}
        `;
    connection.query(sql, (err, res) => {
      if (err) {
        reject({ data: [], require: false, err: err });
      } else {
        if (pagination === "") {
          resolve({ data: res, require: true });
        } else {
          sql = `SELECT COUNT (*) AS total FROM tb_user WHERE  ${filters}`;
          connection.query(sql, function (err, res_total) {
            if (err) {
              reject({ data: [], require: false, err: err });
            } else {
              resolve({ data: res, total: res_total[0].total, require: true });
            }
          });
        }
      }
    });
  });
};

Task.getUserById = function getUserById(data, connection) {
  return new Promise((resolve, reject) => {
    let sql = `
        SELECT 
        tb1.*,
        tb2.*
        FROM ${db["base"]}.tb_user AS tb1
        LEFT JOIN ${db["base"]}.tb_role AS tb2 ON tb1.role_id = tb2.role_id
        WHERE tb1.user_table_uuid = 
        ${connection.escape(data.user_table_uuid)}`;
    connection.query(sql, (err, res) => {
      if (err) {
        reject({ data: [], require: false, err: err });
      } else {
        resolve({ data: res, require: true });
      }
    });
  });
};
Task.insertUser = function insertUser(data, connection) {
  return new Promise((resolve, reject) => {
    const user_table_uuid = uuidv4();
    bcrypt.hash(data.password, saltRounds, function (err, hashedPassword) {
      if (err) {
        reject({ data: [], require: false, err: err });
      } else {
        let sql = `INSERT INTO ${db["base"]}.tb_user SET 
                    user_table_uuid = ${connection.escape(user_table_uuid)}, 
                    username = ${connection.escape(data.username)}, 
                    password = ${connection.escape(hashedPassword)}, 
                    firstname = ${connection.escape(data.firstname)}, 
                    lastname = ${connection.escape(data.lastname)}, 
                    role_id = ${connection.escape(data.role_id)},
                    is_active = 1,
                    create_date = now(),
                    create_by = ${connection.escape(data.create_by)}
                    `;
        connection.query(sql, function (err, res) {
          if (err) {
            reject({ data: [], require: false, err: err });
          } else {
            resolve({ data: [], require: true });
          }
        });
      }
    });
  });
};
Task.checkLogin = function checkLogin(data, connection) {
  return new Promise((resolve, reject) => {
    let sql = `
                  SELECT * 
                  FROM ${db["base"]}.tb_user AS tb1 LEFT JOIN ${db["base"]}.tb_role AS tb2 ON tb1.role_id = tb2.role_id
                  WHERE username = ${connection.escape(data.username)}
                  AND tb1.is_active = 1; 
              `;
    connection.query(sql, function (err, res) {
      if (err) {
        reject({ data: [], require: false, err: err });
      } else {
        if (res.length === 0) {
          resolve({ data: [], require: false, err: "User not found" });
        } else {
          const hashedPassword = res[0].password;
          bcrypt.compare(data.password, hashedPassword, function (err, match) {
            if (err) {
              reject({ data: [], require: false, err: err });
            } else if (!match) {
              resolve({ data: [], require: false, err: "Incorrect password" });
            } else {
              res[0].password = "อยากขาวทักแชท";
              resolve({ data: res, require: true });
            }
          });
        }
      }
    });
  });
};

Task.updateUserById = function updateUserById(data, connection) {
  return new Promise((resolve, reject) => {
    let str_repass = "";
    if (data.password != "" && data.password != null) {
      let newPass = bcrypt.hashSync(data.password, saltRounds);
      str_repass += `password = ${connection.escape(newPass)},`;
    }
    let sql = `
              UPDATE ${db["base"]}.tb_user SET 
              username = ${connection.escape(data.username)}, 
              ${str_repass}
              firstname = ${connection.escape(data.firstname)}, 
              lastname = ${connection.escape(data.lastname)}, 
              role_id = ${connection.escape(data.role_id)},
              update_date = now(),
              update_by = ${connection.escape(data.update_by)}
              WHERE user_table_uuid = ${connection.escape(data.user_table_uuid)}`
    connection.query(sql, (err, res) => {
      if (err) {
        reject({ data: [], require: false, err: err });
      } else {
        resolve({ data: res, require: true });
      }
    });
  });
};

Task.deleteUserById = function deleteUserById(data, connection) {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM ${db["base"]}.tb_user WHERE user_table_uuid = ${connection.escape(data.user_table_uuid)}`;
    connection.query(sql, (err, res) => {
      if (err) {
        reject({ data: [], require: false, err: err });
      } else {
        resolve({ data: res, require: true });
      }
    });
  });
};

module.exports = Task;
