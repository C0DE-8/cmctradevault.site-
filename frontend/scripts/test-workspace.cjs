const { chromium, expect } = require("@playwright/test");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    page.setDefaultTimeout(20000);
    page.setDefaultNavigationTimeout(20000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:5173/login");
    await page.getByLabel("Email or username").fill("tester@valthera.test");
    await page
      .getByLabel("Password", { exact: true })
      .fill("ValtheraTest2026!");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL("**/app");
    console.log("Investor signed in");
    await page.goto("http://127.0.0.1:5173/app/investments");
    await page.getByRole("button", { name: "Review plan" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Investment amount (USD)")).toBeVisible();
    await dialog
      .getByRole("button", { name: "Review investment", exact: true })
      .click();
    await expect(dialog.getByRole("button", { name: /Confirm/ })).toBeVisible();
    console.log("Investment dialog passed");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await page.goto("http://127.0.0.1:5173/app/trading");
    await expect(
      page.getByRole("heading", { name: "Make your next move." }),
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "BTC past day price chart" }),
    ).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: "View TradingView chart" }).click();
    await expect(page.locator('iframe[title*="TradingView"]')).toHaveCount(1, {
      timeout: 30000,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    if (
      !(await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ))
    )
      throw Error("Trading mobile overflow");
    await page.goto("http://127.0.0.1:5173/admin/login");
    await page.getByLabel("Admin email").fill("admin@valthera.test");
    await page
      .getByLabel("Admin password", { exact: true })
      .fill("ValtheraTest2026!");
    await page.getByRole("button", { name: /Sign in/ }).click();
    await page.waitForURL("**/admin");
    await expect(
      page.getByRole("heading", { name: "Your control room." }),
    ).toBeVisible();
    for (const path of ["users", "approvals", "activity"]) {
      await page.goto("http://127.0.0.1:5173/admin/" + path);
      await expect(page.locator("main h1")).toBeVisible();
      await page.waitForTimeout(700);
      if (await page.getByRole("alert").count())
        throw Error(
          "Admin error on " +
            path +
            ": " +
            (await page.getByRole("alert").allTextContents()),
        );
      if (
        !(await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ))
      )
        throw Error("Admin mobile overflow " + path);
    }
    await page.goto("http://127.0.0.1:5173/admin/users");
    await page.getByLabel("Search investors").fill("tester@valthera.test");
    await page.getByRole("button", { name: "Manage account" }).click();
    const manager = page.getByRole("dialog");
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
    ])
      await expect(
        manager.getByRole("heading", { name: asset, exact: true }),
      ).toBeVisible();
    await manager.getByLabel("Balance to adjust").selectOption("BTC");
    await manager
      .getByLabel("Adjustment amount (+ credit / − debit)")
      .fill("0.1");
    await manager
      .getByLabel("Reason for adjustment")
      .fill("Browser review only");
    await manager
      .getByRole("button", { name: "Review balance adjustment" })
      .click();
    await expect(
      manager.getByRole("button", { name: "Confirm & submit" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await page.goto("http://127.0.0.1:5173/app/wallet");
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
    ])
      await expect(
        page.getByRole("heading", { name: asset, exact: true }),
      ).toBeVisible();
    if (
      !(await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ))
    )
      throw Error("Wallet mobile overflow");
    console.log(
      "PASS: all nine user/admin asset balances and admin adjustment review.",
    );
    if (errors.length) throw Error(errors.join("\n"));
    console.log(
      "PASS: investment review dialog, practice terminal, real Binance chart, TradingView iframe, admin login/pages, mobile widths, no browser exceptions.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
