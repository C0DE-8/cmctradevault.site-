require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const mysql = require("mysql2/promise");
const config = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "valthera_local",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "Z",
};
const pool = mysql.createPool(config);
pool.status = async () => {
  const [rows] = await pool.query(
    "SELECT VERSION() AS version, DATABASE() AS database_name",
  );
  return { driver: "mysql2", host: config.host, port: config.port, ...rows[0] };
};
module.exports = pool;
