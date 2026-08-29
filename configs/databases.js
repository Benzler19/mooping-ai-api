const mysql = require("mysql2/promise");
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  timezone: "+07:00",
  connectionLimit: 10,
  charset: "utf8mb4",
  multipleStatements: false,
  acquireTimeout: 3000,
});

const generatePageBy = (data = {}) => {
  let filters = "1=1";
  let params = [];
  let pagination = "";
  let sorter = "";

  if (data.filters) {
    const filterClauses = [];
    Object.entries(data.filters).forEach(([key, value]) => {
      if (value) {
        // ใช้ ? เพื่อทำ Parameterized Query
        filterClauses.push(`LOWER(??) LIKE LOWER(?)`);
        params.push(key, `%${value}%`);
      }
    });
    if (filterClauses.length > 0) {
      filters = filterClauses.join(" OR ");
    }
  }

  if (data.pagination?.current && data.pagination?.pageSize) {
    const offset = (data.pagination.current - 1) * data.pagination.pageSize;
    pagination = `LIMIT ?, ?`;
    params.push(offset, parseInt(data.pagination.pageSize));
  }

  if (data.sorter?.field && data.sorter?.order) {
    const direction = data.sorter.order === "ascend" ? "ASC" : "DESC";
    // หมายเหตุ: ชื่อ field (??) ต้องระวัง ไม่ควรรับมาจาก User โดยตรงโดยไม่มีการตรวจสอบ (Whitelist)
    sorter = `ORDER BY ?? ${direction}`;
    params.push(data.sorter.field);
  }

  return { filters, pagination, sorter, params };
};

module.exports = (req, res, next) => {
  // ฟังก์ชันมาตรฐานสำหรับการ Query ทั่วไป
  req.useConnection = async (callback) => {
    const connection = await pool.getConnection();
    try {
      connection.generatePageBy = generatePageBy;
      await callback(connection, 
        (data) => res.success(data), 
        (err) => res.error(err)
      );
    } catch (err) {
      res.error(err);
    } finally {
      connection.release(); // คืน connection แน่นอน ไม่ว่าจะสำเร็จหรือพัง
    }
  };

  // ฟังก์ชันสำหรับ Transaction (สำคัญมาก)
  req.useTransaction = async (callback) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      connection.generatePageBy = generatePageBy;
      await callback(connection, 
        async (data) => {
          await connection.commit();
          res.success(data);
        }, 
        async (err) => {
          await connection.rollback();
          res.error(err);
        }
      );
    } catch (err) {
      await connection.rollback();
      res.error(err);
    } finally {
      connection.release();
    }
  };

  next();
};