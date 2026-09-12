require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mysql = require("mysql2/promise");
async function create() {
  const name = process.env.DB_NAME || "valthera_local";
  if (!/^[A-Za-z0-9_]+$/.test(name))
    throw new Error(
      "DB_NAME must contain only letters, digits and underscores",
    );
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  });
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    console.log(`Database ${name} ready`);
  } finally {
    await connection.end();
  }
}
create().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
