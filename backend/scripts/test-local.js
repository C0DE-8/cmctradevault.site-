const assert = require("node:assert/strict");
const db = require("../db");
const fs = require("node:fs/promises");
const path = require("node:path");
let userId, token;
async function call(route, body, method = body ? "POST" : "GET") {
  const multipart = body instanceof FormData;
  const response = await fetch("http://127.0.0.1:2080/api/users" + route, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(!multipart && body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? (multipart ? body : JSON.stringify(body)) : undefined,
  });
  const data = await response.json();
  assert(response.ok, `${route}: ${response.status} ${JSON.stringify(data)}`);
  return data;
}
async function test() {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.DB_NAME !== "valthera_local" ||
    !["127.0.0.1", "localhost"].includes(process.env.DB_HOST)
  )
    throw new Error("Tests require local development database");
  const email = `smoke-${Date.now()}@valthera.test`;
  const u = await call("/register", {
    full_name: "Disposable Smoke User",
    username: `smoke${Date.now()}`,
    email,
    password: "SmokeTest2026!",
    address: "1 Test Street",
    city: "Test City",
    country: "US",
    phone: "0000000",
    risk_acknowledged: "yes",
    terms_acknowledged: "yes",
  });
  userId = u.user.id;
  token = u.token;
  await db.query("UPDATE users SET main_balance=2000,pin_hash=? WHERE id=?", [
    "123456",
    userId,
  ]);
  assert(
    (await call("/login", { identifier: email, password: "SmokeTest2026!" }))
      .token,
  );
  const plans = await call("/plans");
  const plan = plans.plans.reduce((a, b) =>
    Number(a.price) < Number(b.price) ? a : b,
  );
  await call("/investments", { plan_id: plan.id, amount: 300 });
  await call("/trades", {
    symbol: "AAPL",
    side: "buy",
    amount: 10,
    duration: "1m",
  });
  await call("/withdrawals", {
    amount: 25,
    pin: "123456",
    method: "bank",
    bank_name: "Local Test Bank",
    bank_account_name: "Smoke User",
    bank_account_number: "00000001",
    bank_country: "US",
  });
  const before = (await call("/balances")).balances.main_balance;
  const denied = await fetch("http://127.0.0.1:2080/api/users/investments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ plan_id: plan.id, amount: 1000000 }),
  });
  assert.equal(denied.status, 400);
  assert.equal((await call("/balances")).balances.main_balance, before);
  const traders = await call("/copy-traders");
  await call(`/copy-traders/${traders.traders[0].id}/copy`, {});
  await call("/copy-traders/stop", {});
  const png = new Blob(
    [
      Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
        "base64",
      ),
    ],
    { type: "image/png" },
  );
  const deposit = new FormData();
  deposit.set("asset", "BTC");
  deposit.set("amount", "50");
  deposit.set("proof", png, "smoke.png");
  await call("/deposits", deposit);
  const kyc = new FormData();
  for (const field of ["selfie", "id_front", "id_back"])
    kyc.set(field, png, "smoke.png");
  await call("/kyc/submit", kyc);
  assert.equal((await call("/kyc")).kyc.status, "pending");
  await call(
    "/change-password",
    { new_password: "SmokeChanged2026!" },
    "PATCH",
  );
  assert(
    (await call("/login", { identifier: email, password: "SmokeChanged2026!" }))
      .token,
  );
  for (const route of [
    "/me",
    "/balances",
    "/deposits",
    "/withdrawals",
    "/investments",
    "/trades",
    "/notify/notification",
    "/account-upgrades",
  ])
    await call(route);
  console.log(
    "PASS: real SQL registration, login, investments, trades, withdrawals, insufficient-funds rollback, copy trading, multipart deposits/KYC, password changes and account reads.",
  );
}
async function cleanup() {
  try {
    if (userId) {
      const [deposits] = await db.query(
        "SELECT proof_filename FROM deposits WHERE user_id=?",
        [userId],
      );
      const [kyc] = await db.query(
        "SELECT selfie_filename,id_front_filename,id_back_filename FROM user_kyc WHERE user_id=?",
        [userId],
      );
      for (const d of deposits)
        if (d.proof_filename)
          await fs.rm(
            path.join(
              __dirname,
              "../uploads/deposits",
              path.basename(d.proof_filename),
            ),
            { force: true },
          );
      for (const k of kyc)
        for (const f of Object.values(k))
          if (f)
            await fs.rm(
              path.join(__dirname, "../uploads/kyc", path.basename(f)),
              { force: true },
            );
      for (const table of [
        "deposits",
        "withdrawals",
        "user_investments",
        "trades",
        "user_kyc",
        "user_crypto_balances",
        "notifications",
        "account_upgrades",
      ])
        await db.query(`DELETE FROM ${table} WHERE user_id=?`, [userId]);
      await db.query("DELETE FROM users WHERE id=?", [userId]);
    }
  } finally {
    await db.end();
  }
}
test()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(cleanup);
