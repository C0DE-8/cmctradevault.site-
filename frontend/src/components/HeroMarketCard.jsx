import { useEffect, useId, useState } from "react";
import { FiArrowUpRight, FiArrowDownRight, FiRefreshCw } from "react-icons/fi";
import { SiBitcoin } from "react-icons/si";
import { getMarket } from "../api/tradingView";
import s from "./HeroMarketCard.module.css";
export default function HeroMarketCard() {
  const [quote, setQuote] = useState(null),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0);
  const gradient = useId();
  useEffect(() => {
    let active = true,
      busy = false;
    const controller = new AbortController();
    async function refresh() {
      if (busy || document.hidden) return;
      busy = true;
      try {
        const data = await getMarket("BTC", controller.signal);
        if (active) {
          setQuote((previous) => ({
            data,
            movement: previous
              ? Math.sign(data.price - previous.data.price)
              : 0,
          }));
          setError(false);
        }
      } catch {
        if (active) setError(true);
      } finally {
        busy = false;
      }
    }
    refresh();
    const interval = setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      clearInterval(interval);
      controller.abort();
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [attempt]);
  const data = quote?.data,
    stale = error || data?.stale;
  const prices = data?.candles.map((c) => c.close) || [];
  const low = Math.min(...prices),
    range = Math.max(...prices) - low || 1;
  const points = prices
    .map(
      (price, i) =>
        `${(i / Math.max(prices.length - 1, 1)) * 600},${175 - ((price - low) / range) * 150}`,
    )
    .join(" ");
  const change = data?.changePercent || 0;
  const ChangeIcon = change < 0 ? FiArrowDownRight : FiArrowUpRight;
  const updated = data
    ? new Date(data.updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  return (
    <div className={s.card}>
      <div className={s.top}>
        <span>
          <SiBitcoin />
          Bitcoin market
        </span>
        <span className={`${s.live} ${stale ? s.stale : ""}`}>
          <i />
          {stale ? "LAST UPDATE" : data ? "LIVE BTC" : "CONNECTING"}
        </span>
      </div>
      <div className={s.label}>
        Bitcoin price <span>BTC / USDT</span>
      </div>
      {data ? (
        <>
          <div
            className={s.balance}
            aria-label={`Bitcoin price ${data.price.toFixed(2)} USDT`}
          >
            <span
              key={data.price}
              className={`${s.price} ${quote.movement < 0 ? s.tickDown : s.tickUp}`}
            >
              {data.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <small>USDT</small>
          </div>
          <div className={`${s.gain} ${change < 0 ? s.negative : ""}`}>
            <ChangeIcon />
            <strong>
              {change > 0 ? "+" : ""}
              {change.toFixed(2)}%
            </strong>
            <span>past 24 hours</span>
            <span className={s.source}>Binance</span>
          </div>
          <svg
            className={s.chart}
            viewBox="0 0 600 190"
            role="img"
            aria-label="Bitcoin price over the past day"
          >
            <defs>
              <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#b3f6aa" stopOpacity=".2" />
                <stop offset="1" stopColor="#b3f6aa" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[35, 85, 135, 185].map((y) => (
              <path
                key={y}
                d={`M0 ${y}H600`}
                stroke="#ffffff0b"
                strokeDasharray="4 5"
              />
            ))}
            <polygon
              points={`0,190 ${points} 600,190`}
              fill={`url(#${gradient})`}
            />
            <polyline
              key={prices.at(-1)}
              className={s.line}
              points={points}
              pathLength="1"
              fill="none"
              stroke="#b3f6aa"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={s.dates}>
            {[0, 6, 12, 18, 23].map(
              (index) =>
                data.candles[index] && (
                  <span key={index}>
                    {new Date(data.candles[index].time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                ),
            )}
          </div>
        </>
      ) : (
        <div className={s.placeholder} role="status">
          <SiBitcoin />
          <span>
            {error
              ? "Bitcoin quote is temporarily unavailable"
              : "Fetching the latest Bitcoin price…"}
          </span>
        </div>
      )}
      <div className={s.bottom}>
        <span>{data ? `Updated ${updated}` : "Binance market data"}</span>
        {error ? (
          <button onClick={() => setAttempt((a) => a + 1)}>
            <FiRefreshCw />
            Retry quote
          </button>
        ) : (
          <span>Refreshes every minute</span>
        )}
      </div>
    </div>
  );
}
