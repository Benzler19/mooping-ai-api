const mysql = require("mysql")
const db = require("./db.json")

const pool = mysql.createPool({
  timezone: "+7:00",
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "benzdev",
  database: db.base,
  charset: "utf8mb4",
  // collation: 'utf8mb4_general_ci',
  acquireTimeout: 30000,
  multipleStatements: true,
})

const connect = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.generatePageBy = (data = []) => {
          let filters = "1"
          let pagination = ""
          let sorter = ""
          if (data.filters) {
            Object.entries(data.filters).forEach(([key, value], index) => {
              if (index == 0 && data.filters[key]) {
                filters = `LOWER(${key}) LIKE (LOWER(${pool.escape(`%${value}%`)})) `
              }
              if (key && index != 0 && data.filters[key]) {
                filters += `OR LOWER(${key}) LIKE (LOWER(${pool.escape(`%${value}%`)})) `
              } else if (data.filters[key] === "") {
                filters = `1`
              }
            })
          }
          if (data.pagination && data.pagination.current && data.pagination.pageSize) {
            pagination = `LIMIT ${(data.pagination.current - 1) * data.pagination.pageSize}, ${data.pagination.pageSize} `
          }
          if (data.sorter && data.sorter.field && data.sorter.order) {
            sorter = `ORDER BY ${data.sorter.field} ${data.sorter.order === "ascend" || data.sorter.order === "ASC" ? "ASC" : "DESC"} `
          }

          return { filters, pagination, sorter }
        }

        resolve(connection)
      }
    })
  })
}

module.exports = (req, res, next) => {
  req.useConnection = async (body) => {
    try {
      const connection = await connect()

      body(
        connection,
        (response) => {
          connection.release()

          res.success(response)
        },
        (err) => {
          connection.release()

          res.error(err)
        }
      )
    } catch (err) {
      res.error(err)
    }
  }

  req.useTransaction = async (body) => {
    try {
      const connection = await connect()

      connection.beginTransaction()

      body(
        connection,
        (response) => {
          connection.commit()
          connection.release()

          res.success(response)
        },
        (err) => {
          connection.rollback()
          connection.release()

          res.error(err)
        }
      )
    } catch (err) {
      res.error(err)
    }
  }

  next()
}
