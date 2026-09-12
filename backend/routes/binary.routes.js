const router = require("express").Router();
const db = require("../db");
const auth = require("../middleware/auth");
const allowed = new Set(["BTC", "ETH", "SOL"]);
const base = "https://data-api.binance.vision/api/v3";
async function price(path) {
  const response = await fetch(base + path, {
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Exchange price unavailable");
  return response.json();
}
function demo(req, res, next) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.DB_NAME !== "valthera_local"
  )
    return res
      .status(403)
      .json({
        message:
          "Practice binary trading is only enabled in the local test environment.",
      });
  if (req.user.role !== "user")
    return res
      .status(403)
      .json({ message: "Use an investor account for practice trades." });
  next();
}
router.get("/binary-trades", auth, demo, async (req, res) => {
  try {
    const [trades] = await db.query(
      "SELECT * FROM binary_trades WHERE user_id=? ORDER BY id DESC LIMIT 100",
      [req.user.id],
    );
    res.json({ trades, payout_percent: 80, mode: "practice" });
  } catch {
    res.status(500).json({ message: "Unable to load practice trades" });
  }
});
router.post("/binary-trades", auth, demo, async (req, res) => {
  if (req.body?.risk_acknowledged !== "yes" || req.body?.terms_acknowledged !== "yes")
    return res.status(400).json({ message: "Please acknowledge investment risk and accept the Terms & Investment Policy before opening a practice contract." });
  const asset = String(req.body.asset || "").toUpperCase(),
    side = req.body.side,
    amount = Number(req.body.amount),
    duration = Number(req.body.duration);
  if (
    !allowed.has(asset) ||
    !["up", "down"].includes(side) ||
    !Number.isFinite(amount) ||
    amount < 1 ||
    amount > 1000000 ||
    Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-7 ||
    ![30, 60, 300].includes(duration)
  )
    return res
      .status(400)
      .json({
        message:
          "Select an asset, direction, 30s/1m/5m duration, and an amount from $1 to $1,000,000 with at most two decimal places.",
      });
  let entry;
  try {
    const data = await price(`/ticker/price?symbol=${asset}USDT`);
    entry = Number(data.price);
    if (!Number.isFinite(entry) || entry <= 0) throw new Error("Invalid price");
  } catch {
    return res
      .status(503)
      .json({
        message:
          "A fresh entry price is unavailable. No test funds were deducted.",
      });
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [[user]] = await conn.query(
      "SELECT main_balance,withdraw_hold,trading_status FROM users WHERE id=? FOR UPDATE",
      [req.user.id],
    );
    if (!user) {
      await conn.rollback();
      return res.status(404).json({ message: "Investor not found" });
    }
    if (user.trading_status !== "active") {
      await conn.rollback();
      return res
        .status(403)
        .json({ message: "Trading is not active on this account." });
    }
    if (Number(user.main_balance) - Number(user.withdraw_hold) < amount) {
      await conn.rollback();
      return res
        .status(400)
        .json({ message: "Insufficient available test balance" });
    }
    const now = Date.now();
    await conn.query(
      "UPDATE users SET main_balance=main_balance-? WHERE id=?",
      [amount, req.user.id],
    );
    const [result] = await conn.query(
      `INSERT INTO binary_trades (user_id,asset,side,amount,entry_price,payout_percent,opened_at_ms,expires_at_ms) VALUES (?,?,?,?,?,80,?,?)`,
      [req.user.id, asset, side, amount, entry, now, now + duration * 1000],
    );
    await conn.commit();
    res.json({
      message: "Practice contract opened. Test funds reserved.",
      trade_id: result.insertId,
    });
  } catch (error) {
    await conn.rollback();
    console.error("Binary order:", error.code || error.message);
    res.status(500).json({ message: "Unable to open practice contract" });
  } finally {
    conn.release();
  }
});
router.post("/binary-trades/settle", auth, demo, async (req, res) => {
  try {
    const [expired] = await db.query(
      "SELECT id,asset,expires_at_ms FROM binary_trades WHERE user_id=? AND status='open' AND expires_at_ms<? ORDER BY id LIMIT 20",
      [req.user.id, Date.now() - 2000],
    );
    let settled = 0,
      unavailable = 0;
    for (const trade of expired) {
      let exit;
      try {
        const start = Math.floor(Number(trade.expires_at_ms) / 1000) * 1000;
        const rows = await price(
          `/klines?symbol=${trade.asset}USDT&interval=1s&startTime=${start}&endTime=${start + 999}&limit=1`,
        );
        if (
          !Array.isArray(rows) ||
          !rows.length ||
          rows[0][0] !== start ||
          rows[0][6] >= Date.now()
        )
          throw new Error("Expiry candle unavailable");
        exit = Number(rows[0][4]);
        if (!Number.isFinite(exit) || exit <= 0)
          throw new Error("Invalid exit price");
      } catch {
        unavailable++;
        continue;
      }
      const conn = await db.getConnection();
      try {
        await conn.beginTransaction();
        const [[locked]] = await conn.query(
          "SELECT * FROM binary_trades WHERE id=? AND user_id=? FOR UPDATE",
          [trade.id, req.user.id],
        );
        if (locked.status !== "open") {
          await conn.rollback();
          continue;
        }
        const entry = Number(locked.entry_price),
          amount = Number(locked.amount),
          tie = exit === entry,
          win = locked.side === "up" ? exit > entry : exit < entry;
        const payout = tie
          ? amount
          : win
            ? Math.round(
                amount * (1 + Number(locked.payout_percent) / 100) * 100,
              ) / 100
            : 0;
        const outcome = tie ? "tie" : win ? "won" : "lost";
        await conn.query(
          "UPDATE binary_trades SET status=?,exit_price=?,pnl=?,settled_at_ms=? WHERE id=?",
          [outcome, exit, payout - amount, Date.now(), trade.id],
        );
        await conn.query(
          "UPDATE users SET main_balance=main_balance+? WHERE id=?",
          [payout, req.user.id],
        );
        await conn.commit();
        settled++;
      } catch (e) {
        await conn.rollback();
        throw e;
      } finally {
        conn.release();
      }
    }
    res.json({
      message: unavailable
        ? `${settled} settled; ${unavailable} awaiting an exchange price.`
        : `${settled} practice contracts settled.`,
      settled,
      unavailable,
    });
  } catch {
    res
      .status(500)
      .json({
        message:
          "Unable to settle practice contracts. Open contracts remain pending.",
      });
  }
});
module.exports = router;
