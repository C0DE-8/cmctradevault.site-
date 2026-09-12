# Valthera Investments local backend

The API uses a normal `mysql2/promise` connection pool with real MySQL/MariaDB transactions.

## Local services

- Frontend: http://localhost:5173
- API: http://127.0.0.1:2080
- Health: http://127.0.0.1:2080/api/health
- SQL: existing XAMPP MariaDB on `127.0.0.1:3306`
- Database: `valthera_local`

`.env` contains the local connection configuration. `.env.example` documents the settings. XAMPP's local root account is used; no remote database is involved. Email delivery is disabled with `MAIL_ENABLED=false` so local logins do not send mail.

## Setup and run

Start MySQL in XAMPP, then from this folder:

```sh
npm install
npm run setup:local
npm start
```

`setup:local` creates the database if absent, runs the additive schema migration, and seeds local test records. `npm run migrate` can be rerun and closes its pool when finished. The legacy SQL dumps contain old data and are not needed for a fresh local installation. No dump or remote customer data was imported.

For automatic API reload during development, use `npm run dev` instead of `npm start`.

## Test accounts

| Account  | Email                | Password          |
| -------- | -------------------- | ----------------- |
| Investor | tester@valthera.test | ValtheraTest2026! |
| Admin    | admin@valthera.test  | ValtheraTest2026! |

The investor starts with **10,000 USD of local test balance** and withdrawal PIN **123456**. Sign in to the admin workspace at http://localhost:5173/admin/login. It includes investor trading controls, deposit/withdrawal/KYC reviews, and paginated activity logs. Admin and investor sessions are separate. Seeds also include sample plans, a local demo copy trader, a notification, and a deliberately invalid BTC deposit address marked `LOCAL-TEST-ONLY`. Use a sample image for deposit proof. Do not send real funds.

Seeding is restricted to development, localhost, and the `valthera_local` database. Rerunning it preserves existing passwords, balances, and account activity. Set `LOCAL_TEST_PASSWORD` before the first seed to use a different test password.

## Validation

With the API running:

```sh
npm test
npm run test:workspace
```

This registers a disposable local account and exercises login, balances, investment and trade creation, withdrawal requests, insufficient-funds rollback, copy trading, deposit proof upload, KYC upload, and password updates. The disposable account, activity, and uploaded test files are removed afterward. The seeded investor remains ready for manual testing.

## Landing-page market data

The cards show exchange data by default, with a TradingView switch using its established iframe embed. The frontend requests `/api/markets/BTC`, `/api/markets/ETH`, and `/api/markets/SOL`. These allowlisted endpoints fetch actual Binance public USDT quotes and hourly candles from `data-api.binance.vision`, with a 60-second cache, coalesced requests, and upstream timeouts. The chart labels its source, currency, timestamp, and stale state. This feed is for display only and does not execute orders or settle trades.

For deployment, configure real database credentials, secret keys, the bind address (`HOST`), email settings, and real funding addresses. Local seeds and their test balances are not production data.

## Trading and administration

The trading terminal at `/app/trading` provides local practice Up/Down contracts for BTC, ETH, and SOL, with 30-second, 1-minute, and 5-minute expiries. Stake is debited when opened. A win returns the stake plus 80%, a tie returns the stake, and a loss returns zero. Use **Settle expired contracts** after expiry. Settlement uses the close of Binance’s one-second candle containing the expiry; unavailable quotes leave contracts open for retry. Settlement is transactional and cannot credit twice. No exchange orders are placed. These routes are restricted to development and the `valthera_local` database.

The terminal has Binance charts and an optional TradingView advanced chart. Account signal strength and progress are administrative indicators, not market predictions. Administrators edit them in Investors → Manage trading.

The migration adds `binary_trades` and `admin_audit_logs`. Audit records capture admin sign-ins and mutation routes, actors, timestamps, and HTTP outcomes without request bodies or credentials. Withdrawal approval records the administrative action; it does not send an external payment.

Browser checks: from `frontend`, run `node scripts/test-workspace.cjs` with `PLAYWRIGHT_EXECUTABLE_PATH` set if Chromium is not installed at Playwright’s default path. These checks review an investment without submitting it. Backend workspace checks use a disposable investor and remove its data afterward.

## Balance management

Users see BTC, ETH, USDT, BNB, LTC, DOGE, XRP, SHIB, and SOL in `/app/wallet`, including zero balances. Crypto balances are coin units, separate from USD main, profit, and investment balances. Admins use **Investors → Manage account → Account balances** to credit a positive amount or debit a negative amount. A reason and review are required. USD supports two decimal places; crypto supports eight. Overdrafts and debits into withdrawal reserves are rejected. Adjustments and their before/after balances are committed together in `balance_adjustments`, with recent history available in the account dialog. The old generic user-update endpoint rejects balance fields; use the dedicated adjustment endpoint. These ledger edits do not send blockchain transactions or change individual investment records.
