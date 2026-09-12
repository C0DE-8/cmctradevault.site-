const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
const BASE = process.env.SMOKE_BASE_URL || "http://127.0.0.1:5173";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(BASE + "/");
  await page
    .getByRole("heading", { name: "A little vision. A bigger future." })
    .waitFor();

  await page.getByText("What can I do with Valthera Investments?").click();
  assert(
    await page
      .getByText("Manage your account, explore investment plans,")
      .isVisible(),
  );
  await page.getByRole("link", { name: "Explore the platform" }).click();
  await page.getByRole("heading", { name: "Welcome back, Alex." }).waitFor();
  await page.goto(BASE + "/app/wallet");
  await page.waitForURL("**/login");
  const calls = [];
  await page.route("**/api/users/**", async (route) => {
    const req = route.request(),
      path = new URL(req.url()).pathname.replace("/api/users", "");
    if (req.method() !== "GET") {
      calls.push({ path, body: req.postData() });
      if (path === "/login")
        return route.fulfill({
          json: { token: "test-token", user: { id: 1 } },
        });
      return route.fulfill({ json: { message: "Request accepted" } });
    }
    const responses = {
      "/me": {
        user: {
          full_name: "Test Investor",
          email: "test@example.com",
          main_balance: 1000,
          profit_balance: 25,
          investment_balance: 200,
        },
      },
      "/balances": { balances: { main_balance: 1000 } },
      "/investments": { investments: [] },
      "/plans": {
        plans: [
          {
            id: 1,
            name: "Starter plan",
            price: 100,
            roi_percent: 5,
            duration_days: 30,
          },
        ],
      },
      "/wallet-addresses": {
        wallets: [
          { id: 1, asset: "BTC", address: "example-address-do-not-send" },
        ],
      },
      "/deposits": { deposits: [] },
      "/withdrawals": { withdrawals: [] },
      "/trades": { trades: [] },
      "/copy-traders": {
        traders: [
          {
            id: 1,
            trader_name: "Sample Trader",
            win_rate_percent: 50,
            profit_percent: 5,
          },
        ],
      },
      "/copy-traders/status": { copy_trading_status: "inactive", trader: null },
      "/kyc": { kyc: null },
      "/notify/notification": { notifications: [] },
    };
    await route.fulfill({ json: responses[path] || {} });
  });
  await page.getByLabel("Email or username").fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("example-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("heading", { name: "Welcome, Test." }).waitFor();
  await page.getByRole("link", { name: "Investments", exact: true }).click();
  await page.getByRole("button", { name: "Review plan" }).click();
  await page.getByLabel("Investment amount (USD)").fill("150");
  await page.getByRole("button", { name: "Review investment" }).click();
  assert(!calls.some((c) => c.path === "/investments"));
  await page.getByRole("button", { name: "Confirm & submit" }).click();
  await page.getByRole("button", { name: "Review plan" }).waitFor();
  assert(
    calls.some(
      (c) => c.path === "/investments" && JSON.parse(c.body).amount === "150",
    ),
  );
  await page.getByRole("link", { name: "Wallet", exact: true }).click();
  await page.getByLabel("Deposit asset").selectOption("BTC");
  await page
    .getByText("example-address-do-not-send", { exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Withdraw", exact: true }).click();
  await page.getByLabel("Amount (USD)", { exact: true }).fill("25");
  await page
    .getByLabel("Destination wallet address")
    .fill("test-wallet-address");
  await page.getByLabel("Network", { exact: true }).fill("BTC");
  await page.getByLabel("Withdrawal PIN").fill("1234");
  await page.getByRole("button", { name: "Review withdrawal" }).click();
  assert(!calls.some((c) => c.path === "/withdrawals"));
  await page.getByRole("button", { name: "Confirm & submit" }).click();
  await page.getByText("Request accepted").waitFor();
  await page.getByRole("link", { name: "Trading", exact: true }).click();
  await page.getByLabel("Instrument symbol").fill("AAPL");
  await page.getByLabel("Trade amount (USD)").fill("10");
  await page.getByRole("button", { name: "Review trade" }).click();
  await page.getByRole("button", { name: "Confirm & submit" }).click();
  await page.getByText("Request accepted").waitFor();
  await page.getByRole("link", { name: "Copy trading", exact: true }).click();
  await page.getByRole("button", { name: "Review trader" }).click();
  await page.getByRole("button", { name: "Review copy request" }).click();
  await page.getByRole("button", { name: "Confirm & submit" }).click();
  await page
    .getByRole("link", { name: "Account settings", exact: true })
    .click();
  await page.getByRole("heading", { name: "Identity verification" }).waitFor();
  await page
    .getByLabel("New password", { exact: true })
    .fill("new-password-123");
  await page.getByLabel("Confirm new password").fill("new-password-123");
  await page.getByRole("button", { name: "Update password" }).click();
  await page.getByText("Request accepted").waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + "/");
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("link", { name: "How it works", exact: true }).click();
  await page.goto(BASE + "/app");
  await page.getByRole("heading", { name: "Welcome, Test." }).waitFor();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Wallet", exact: true }).click();
  await page.getByRole("heading", { name: "Your wallet." }).waitFor();
  await page.route("**/api/users/plans", (r) =>
    r.fulfill({
      status: 503,
      json: { message: "Plans temporarily unavailable" },
    }),
  );
  await page.goto(BASE + "/app/investments");
  await page
    .getByRole("alert")
    .filter({ hasText: "Plans temporarily unavailable" })
    .waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: landing, FAQ, preview, protected routes, login, investment review, withdrawals, trades, copy trading, password update, mobile navigation, overflow, API errors; no browser exceptions.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
