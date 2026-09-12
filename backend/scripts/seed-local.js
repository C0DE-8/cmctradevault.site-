const db = require("../db");
const bcrypt = require("bcrypt");
async function seed() {
  if (
    process.env.NODE_ENV !== "development" ||
    !["localhost", "127.0.0.1"].includes(process.env.DB_HOST) ||
    process.env.DB_NAME !== "valthera_local"
  )
    throw new Error(
      "Local seeding is restricted to valthera_local on localhost in development.",
    );
  const password = process.env.LOCAL_TEST_PASSWORD || "ValtheraTest2026!";
  const hash = await bcrypt.hash(password, 12);
  await db.query(
    `INSERT INTO users (full_name,username,email,password_hash,role,is_verified,main_balance,pin_hash,country,address,city,phone) VALUES ('Local Test Investor','tester','tester@valthera.test',?,'user',1,10000,'123456','United States','1 Test Street','Test City','0000000000') ON DUPLICATE KEY UPDATE email=VALUES(email)`,
    [hash],
  );
  await db.query(
    `INSERT INTO admins (name,email,password_hash) VALUES ('Local Test Admin','admin@valthera.test',?) ON DUPLICATE KEY UPDATE email=VALUES(email)`,
    [hash],
  );
  await db.query(
    `INSERT INTO copy_traders (trader_name,win_rate_percent,profit_percent,is_active) SELECT 'Local Demo Trader',50,0,1 WHERE NOT EXISTS (SELECT 1 FROM copy_traders WHERE trader_name='Local Demo Trader')`,
  );
  await db.query(
    `INSERT INTO notifications (user_id,type,title,message) SELECT id,'notification','Local testing account','This local account contains test funds only. No real funds or deposits are required.' FROM users WHERE email='tester@valthera.test' AND NOT EXISTS (SELECT 1 FROM notifications WHERE title='Local testing account')`,
  );
  await db.query(
    `INSERT INTO wallet_addresses (asset,address) VALUES ('BTC','LOCAL-TEST-ONLY-NO-BLOCKCHAIN-ADDRESS') ON DUPLICATE KEY UPDATE asset=VALUES(asset)`,
  );
  console.log(
    "Local test accounts ready: tester@valthera.test and admin@valthera.test. Existing accounts were not reset.",
  );
}
seed()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
