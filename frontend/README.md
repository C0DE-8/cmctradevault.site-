# Valthera Investments frontend

React investment workspace and responsive landing page. Uses React Router, React Icons, and component/page CSS modules.

## Run locally

Use Node 22.13+ (the existing Vite 8 toolchain requires a modern Node runtime).

```sh
npm install
npm run dev
```

Start the existing backend separately with `node server.js` from `backend/`, using its configured environment. Vite proxies `/api` and `/uploads` to `http://localhost:2080`. No database credentials belong in the frontend.

For a separately hosted backend, copy `.env.example` to `.env.local` and set `VITE_API_URL` to the complete user API base URL. Production hosting must rewrite unknown frontend paths to `index.html` for React Router, and proxy `/api` to the backend if using the default relative API URL.

## Structure

- `src/api/`: fetch client, session token storage, API error handling
- `src/components/`: shared UI, workspace layout, reviewed action forms
- `src/pages/`: landing, authentication, dashboard, investments, wallet, trading, copy trading, settings, not found
- `src/hooks/`: API data loading and refresh
- `src/index.css`: shared tokens, typography, resets; visual components and pages have colocated `.module.css` files

## Routes and behavior

`/` is the public landing page. `/preview` is explicitly illustrative and makes no account API calls. `/login` and `/register` use the existing backend authentication. `/app` and its subroutes require a session token, stored in sessionStorage. Expired authentication redirects to sign-in; business errors such as an invalid withdrawal PIN do not sign the user out.

Live account pages only display backend data. Investment, withdrawal, trade, and copy-trading actions include a review step; deposits and KYC use multipart image uploads. Backend authorization and validation remain authoritative.

This is an account-based platform, not a self-custody wallet or on-chain execution client. There is no live pricing API in the supplied backend. The landing page shows real Binance USDT quotes and candles from same-origin `/api/markets` endpoints by default, with TradingView’s established iframe charts available through a per-card switch; the fallback labels the exchange, pair, timestamp, and stale state. The hero uses actual Binance BTC/USDT prices, 24-hour change, and hourly candles, refreshing every minute with price-change animation. Only the separate preview account remains illustrative; live account pages use actual balance allocation. Withdrawal PIN provisioning and profile edits are administrator-managed in the supplied backend.

## Checks

```sh
npm run build
npm run lint
```

Live funding, order execution, registration, and identity review require the configured backend and database. Validate those in a staging environment before production use.

## Browser smoke test

With the frontend development server running:

```sh
npx playwright install chromium
npm run test:smoke
```

The test uses controlled API responses; it never submits live funds or creates live accounts. It checks the public pages, mobile navigation, protected routes, authentication, review-before-submit behavior, account actions, and server errors. Set `SMOKE_BASE_URL` for a different frontend URL or `PLAYWRIGHT_EXECUTABLE_PATH` to use an existing Chromium installation.

Hero animation uses CSS transforms for orbital light trails and independent coin motion. A pause control and the system’s reduced-motion preference stop decorative movement. TradingView integration follows the [official widget setup](https://www.tradingview.com/widget-docs/tutorials/web-components/configuring/) and [theming documentation](https://www.tradingview.com/widget-docs/tutorials/web-components/styling-and-themes/).

For local database setup, test accounts, and API tests, see [backend setup](../backend/README.md). The frontend proxies `/api/markets` to the running local backend. Set `VITE_MARKET_API_URL` when hosting the market API separately.

Run `npm run test:local` with both services running to check actual SQL login, normal TradingView embeds, and real fallback charts with TradingView blocked. This check needs network access and the default seeded investor credentials.





### Expanded landing page

The landing page retains the existing dark green / mint design and adds trading approach controls, two automatically scrolling coin strips, a lazy-loaded TradingView Bitcoin news feed, a mining electricity-cost explorer, community testimonials availability, and additional FAQs. The brand preloader clears after 350 ms (immediately with reduced motion).

The public market endpoint supports BTC, ETH, SOL, XRP, ADA, DOGE, AVAX, and LINK in USDT. Restart the backend to pick up the expanded allowlist. Quotes refresh every minute; failed requests display an unavailable state and cached provider responses can be marked delayed.

Mining is a frontend preview, explicitly marked coming soon. It does not connect hardware, mine coins, or credit balances. The electricity calculator uses an illustrative $0.10/kWh over 24 hours. Customer testimonials are not fabricated: the community section awaits verified, approved stories.

Run `npm run test:landing` with the frontend at http://127.0.0.1:5173. Set `PLAYWRIGHT_EXECUTABLE_PATH` if using an existing Chrome installation. Tests mock market quotes and an unavailable news feed, check trading controls, pause controls, the cost calculator, mobile navigation, reduced motion, and overflow at five widths.
