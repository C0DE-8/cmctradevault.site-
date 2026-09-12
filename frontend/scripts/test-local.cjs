const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
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
  await page.route(/^https:\/\/[^/]*tradingview[^/]*\//, (route) =>
    route.abort(),
  );
  await page.goto("http://127.0.0.1:5173/");
  await page.locator("#markets").scrollIntoViewIfNeeded();
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: "View TradingView chart" })
      .first()
      .click();
  await page
    .getByRole("img", { name: "BTC past day price chart" })
    .waitFor({ timeout: 30000 });
  await page
    .getByRole("img", { name: "ETH past day price chart" })
    .waitFor({ timeout: 30000 });
  await page
    .getByRole("img", { name: "SOL past day price chart" })
    .waitFor({ timeout: 30000 });
  assert.equal(
    await page
      .getByText("Market connection unavailable", { exact: true })
      .count(),
    0,
  );
  console.log(
    "PASS: real exchange quotes and charts with TradingView blocked.",
  );
  await page.goto("http://127.0.0.1:5173/login");
  await page.getByLabel("Email or username").fill("tester@valthera.test");
  await page.getByLabel("Password", { exact: true }).fill("ValtheraTest2026!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("heading", { name: "Welcome, Local." }).waitFor();
  assert((await page.getByText("$10,000.00", { exact: true }).count()) > 0);
  await page
    .getByRole("link", { name: "Account settings", exact: true })
    .click();
  await page.getByRole("heading", { name: "Identity verification" }).waitFor();
  assert.equal(await page.getByRole("alert").count(), 0);
  console.log("PASS: browser login and account pages against local SQL.");
  await page.unroute(/^https:\/\/[^/]*tradingview[^/]*\//);
  await page.goto("http://127.0.0.1:5173/");
  await page.locator("#markets").scrollIntoViewIfNeeded();
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: "View TradingView chart" })
      .first()
      .click();
  await page.waitForFunction(
    () =>
      document.querySelectorAll('iframe[title*="TradingView price chart"]')
        .length === 3,
    {},
    { timeout: 30000 },
  );
  await page.waitForTimeout(8000);
  console.log(
    "Frames:",
    page
      .frames()
      .filter((f) => f.url().includes("tradingview"))
      .map((f) => f.url().split("?")[0]),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: TradingView iframes, mobile width, no browser exceptions.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
