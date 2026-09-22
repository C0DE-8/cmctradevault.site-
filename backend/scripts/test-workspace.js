const assert = require("node:assert/strict");
const db = require("../db");
const fs = require("node:fs/promises");
const path = require("node:path");
let userId, token, adminToken;
async function req(
  scope,
  route,
  body,
  method = body ? "POST" : "GET",
  expected = 200,
  override,
) {
  const multi = body instanceof FormData;
  const auth =
    override === undefined
      ? scope === "admin"
        ? adminToken
        : token
      : override;
  const response = await fetch(`http://127.0.0.1:2080/api/${scope}/${route}`, {
    method,
    headers: {
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      ...(body && !multi ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? (multi ? body : JSON.stringify(body)) : undefined,
  });
  const data = await response.json();
  assert.equal(response.status, expected, `${route}: ${JSON.stringify(data)}`);
  return data;
}
async function test() {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.DB_NAME !== "valthera_local" ||
    !["localhost", "127.0.0.1"].includes(process.env.DB_HOST)
  )
    throw new Error("Requires local test database");
  adminToken = (
    await req("admin", "login", {
      email: "admin@valthera.test",
      password: "ValtheraTest2026!",
    })
  ).token;
  assert(adminToken);
  assert((await req("admin", "me")).admin.email === "admin@valthera.test");
  const u = await req("users", "register", {
    full_name: "Workspace Test",
    username: `workspace${Date.now()}`,
    email: `workspace${Date.now()}@valthera.test`,
    password: "WorkspaceTest2026!",
    address: "Test Street",
    city: "Test",
    country: "US",
    phone: "0000",
    risk_acknowledged: "yes",
    terms_acknowledged: "yes",
  });
  userId = u.user.id;
  token = u.token;
  await db.query("UPDATE users SET main_balance=2000,pin_hash=? WHERE id=?", [
    "123456",
    userId,
  ]);
  await req("admin", "audit-logs", undefined, "GET", 403, token);
  await req(
    "admin",
    `users/${userId}/trading-settings`,
    {
      signal_strength: 72,
      trade_progress: 35,
      trading_status: "active",
      currency_symbol: "£",
    },
    "PATCH",
  );
  const updatedProfile = (await req("users", "me")).user;
  assert.equal(Number(updatedProfile.signal_strength), 72);
  assert.equal(updatedProfile.currency_symbol, "£");
  assert.equal((await req("users", "balances")).balances.currency_symbol, "£");
  await req(
    "admin",
    `users/${userId}/trading-settings`,
    { signal_strength: 101, trade_progress: 35, trading_status: "active" },
    "PATCH",
    400,
  );
  for (const route of [
    "overview",
    "users",
    "deposits?status=pending",
    "withdrawals?status=pending",
    "kyc?status=pending",
    "audit-logs",
  ])
    await req("admin", route);
  const adjustmentRoute = `users/${userId}/balance-adjustments`;
  for (const asset of [
    "BTC",
    "ETH",
    "USDT",
    "BNB",
    "LTC",
    "DOGE",
    "XRP",
    "SHIB",
    "SOL",
  ]) {
    await req("admin", adjustmentRoute, {
      balance_key: asset,
      amount: "1.12345678",
      reason: "Local asset test",
    });
    assert.equal(
      (await req("users", "balances")).balances.crypto_balances[asset],
      "1.12345678",
    );
  }
  await req("admin", adjustmentRoute, {
    balance_key: "BTC",
    amount: "-0.12345678",
    reason: "Local debit test",
  });
  assert.equal(
    (await req("users", "balances")).balances.crypto_balances.BTC,
    "1.00000000",
  );
  await req(
    "admin",
    adjustmentRoute,
    { balance_key: "BTC", amount: "-2", reason: "Overdraft test" },
    "POST",
    400,
  );
  await req(
    "admin",
    adjustmentRoute,
    { balance_key: "BTC", amount: "1", reason: "Unauthorized" },
    "POST",
    403,
    token,
  );
  await req(
    "admin",
    adjustmentRoute,
    { balance_key: "main_balance", amount: "0.001", reason: "Precision test" },
    "POST",
    400,
  );
  await req("admin", `users/${userId}`, { main_balance: 1 }, "PUT", 400);
  await req("admin", adjustmentRoute, {
    balance_key: "profit_balance",
    amount: "20.25",
    reason: "Profit test",
  });
  assert.equal(
    Number((await req("users", "balances")).balances.profit_balance),
    20.25,
  );
  assert.equal((await req("admin", adjustmentRoute)).adjustments.length, 11);
  await db.query("UPDATE users SET withdraw_hold=1999 WHERE id=?", [userId]);
  await req(
    "admin",
    adjustmentRoute,
    {
      balance_key: "main_balance",
      amount: "-2",
      reason: "Reserved funds test",
    },
    "POST",
    400,
  );
  await db.query("UPDATE users SET withdraw_hold=0 WHERE id=?", [userId]);
  const plans = (await req("users", "plans")).plans;
  const plan = plans.reduce((a, b) =>
    Number(a.price) < Number(b.price) ? a : b,
  );
  await db.query("UPDATE users SET withdraw_hold=1900 WHERE id=?", [userId]);
  await req(
    "users",
    "investments",
    { plan_id: plan.id, amount: 250, risk_acknowledged: "yes", terms_acknowledged: "yes" },
    "POST",
    400,
  );
  await db.query("UPDATE users SET withdraw_hold=0 WHERE id=?", [userId]);
  await req("users", "investments", { plan_id: plan.id, amount: 250, risk_acknowledged: "yes", terms_acknowledged: "yes" });
  assert.equal(
    Number((await req("users", "balances")).balances.main_balance),
    1750,
  );
  const contract = await req("users", "binary-trades", {
    asset: "BTC",
    side: "up",
    amount: 10,
    duration: 30,
    risk_acknowledged: "yes",
    terms_acknowledged: "yes",
  });
  assert.equal(
    Number((await req("users", "balances")).balances.main_balance),
    1740,
  );
  // Move only this disposable contract into a historical test window; use a known
  // winning strike to verify exact payout and duplicate-settlement protection.
  await db.query(
    "UPDATE binary_trades SET expires_at_ms=?,entry_price=1 WHERE id=? AND user_id=?",
    [Date.now() - 20000, contract.trade_id, userId],
  );
  const settled = await req("users", "binary-trades/settle", {});
  assert.equal(
    settled.unavailable,
    0,
    "Historical expiry quote should be available",
  );
  assert.equal(settled.settled, 1);
  assert.equal(
    Number((await req("users", "balances")).balances.main_balance),
    1758,
  );
  await req("users", "binary-trades/settle", {});
  assert.equal(
    Number((await req("users", "balances")).balances.main_balance),
    1758,
  );
  await req(
    "admin",
    `users/${userId}/trading-settings`,
    { signal_strength: 72, trade_progress: 35, trading_status: "locked" },
    "PATCH",
  );
  await req(
    "users",
    "binary-trades",
    { asset: "BTC", side: "down", amount: 10, duration: 30 },
    "POST",
    403,
  );
  await req(
    "admin",
    `users/${userId}/trading-settings`,
    { signal_strength: 72, trade_progress: 35, trading_status: "active" },
    "PATCH",
  );
  const png = new Blob(
    [
      Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
        "base64",
      ),
    ],
    { type: "image/png" },
  );
  const form = new FormData();
  form.set("asset", "BTC");
  form.set("amount", "50");
  form.set("proof", png, "test.png");
  await req("users", "deposits", form);
  const deposit = (await req("users", "deposits")).deposits[0];
  await req("admin", `deposits/${deposit.id}/approve`, {
    admin_note: "Automated local test",
  });
  assert.equal(
    Number((await req("users", "balances")).balances.main_balance),
    1808,
  );
  await req("admin", `deposits/${deposit.id}/approve`, {}, "POST", 400);
  assert.equal(
    Number((await req("users", "balances")).balances.main_balance),
    1808,
  );
  const logs = (await req("admin", "audit-logs")).logs;
  assert(logs.some((l) => l.resource === `/users/${userId}/trading-settings`));
  assert(logs.some((l) => l.resource === `/deposits/${deposit.id}/approve`));
  assert(!JSON.stringify(logs).includes("ValtheraTest2026!"));
  console.log(
    "PASS: admin authentication/authorization, indicators, request approval, audit logs, investment reserved funds, practice binary entry and historical settlement, payout idempotency, and locked-account protection.",
  );
}
async function cleanup() {
  try {
    if (userId) {
      const [rows] = await db.query(
        "SELECT proof_filename FROM deposits WHERE user_id=?",
        [userId],
      );
      for (const row of rows)
        await fs.rm(
          path.join(
            __dirname,
            "../uploads/deposits",
            path.basename(row.proof_filename),
          ),
          { force: true },
        );
      for (const table of [
        "deposits",
        "withdrawals",
        "user_investments",
        "trades",
        "balance_adjustments",
        "binary_trades",
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
