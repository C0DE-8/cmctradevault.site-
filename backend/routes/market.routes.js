const express = require("express");
const router = express.Router();
const cache = new Map();
const pending = new Map();
const symbols = new Set(["BTC", "ETH", "SOL", "XRP", "ADA", "DOGE", "AVAX", "LINK"]);
async function fetchMarket(asset) {
  const symbol = `${asset}USDT`;
  const base = "https://data-api.binance.vision/api/v3";
  const read = async (path) => {
    const response = await fetch(`${base}${path}`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok)
      throw new Error(`Market provider returned ${response.status}`);
    return response.json();
  };
  const [ticker, candles] = await Promise.all([
    read(`/ticker/24hr?symbol=${symbol}`),
    read(`/klines?symbol=${symbol}&interval=1h&limit=24`),
  ]);
  if (
    !Array.isArray(candles) ||
    !Number.isFinite(Number(ticker.lastPrice)) ||
    Number(ticker.lastPrice) <= 0
  )
    throw new Error("Invalid market response");
  const result = {
    asset,
    symbol,
    quote: "USDT",
    source: "Binance",
    price: Number(ticker.lastPrice),
    changePercent: Number(ticker.priceChangePercent),
    updatedAt: new Date(ticker.closeTime).toISOString(),
    fetchedAt: Date.now(),
    candles: candles.map((c) => ({ time: c[0], close: Number(c[4]) })),
    stale: false,
  };
  cache.set(asset, result);
  return result;
}
router.get("/:asset", async (req, res) => {
  const asset = req.params.asset.toUpperCase();
  if (!symbols.has(asset))
    return res.status(400).json({ message: "Unsupported market" });
  const cached = cache.get(asset);
  res.set("Cache-Control", "public, max-age=30");
  if (cached && Date.now() - cached.fetchedAt < 60000) return res.json(cached);
  try {
    if (!pending.has(asset))
      pending.set(
        asset,
        fetchMarket(asset).finally(() => pending.delete(asset)),
      );
    res.json(await pending.get(asset));
  } catch {
    if (cached && Date.now() - cached.fetchedAt < 15 * 60 * 1000)
      return res.json({ ...cached, stale: true });
    res
      .status(503)
      .json({
        message: "Market data is temporarily unavailable. Please retry.",
      });
  }
});
module.exports = router;
