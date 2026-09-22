import { useEffect, useRef, useState, useId } from "react";
import { FiActivity, FiRefreshCw } from "react-icons/fi";
import { mountTradingView, getMarket } from "../api/tradingView";
import s from "./MarketChart.module.css";
export default function MarketChart({ asset, symbol, advanced = false }) {
  const root = useRef(null),
    embed = useRef(null),
    gradient = useId();
  const [preferTradingView, setPreferTradingView] = useState(false);
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [data, setData] = useState(null),
    [dataError, setDataError] = useState(false),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true,
      cleanup = () => {},
      timer;
    const controller = new AbortController();
    const refresh = () =>
      getMarket(asset, controller.signal)
        .then((result) => {
          if (active) {
            setData(result);
            setDataError(false);
          }
        })
        .catch(() => {
          if (active) setDataError(true);
        });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (preferTradingView)
          cleanup = mountTradingView(
            embed.current,
            symbol,
            () => {
              if (active) {
                setReady(true);
                setFailed(false);
              }
            },
            () => {
              if (active) setFailed(true);
            },
            advanced,
          );
        refresh();
        timer = setInterval(refresh, 60000);
      },
      { rootMargin: "250px" },
    );
    observer.observe(root.current);
    return () => {
      active = false;
      observer.disconnect();
      cleanup();
      clearInterval(timer);
      controller.abort();
    };
  }, [asset, symbol, attempt, preferTradingView, advanced]);
  function retry() {
    setFailed(false);
    setReady(false);
    setDataError(false);
    setAttempt((n) => n + 1);
  }
  const values = data?.candles?.map((c) => c.close) || [];
  const min = Math.min(...values),
    range = Math.max(...values) - min || 1;
  const points = values
    .map(
      (v, i) =>
        `${(i / Math.max(values.length - 1, 1)) * 300},${120 - ((v - min) / range) * 100}`,
    )
    .join(" ");
  const showWidget = preferTradingView && ready;
  return (
    <div ref={root} className={s.chart}>
      <div
        ref={embed}
        className={`${s.embed} ${showWidget ? s.visible : ""}`}
        aria-hidden={!showWidget}
      />
      <button
        className={s.switchFeed}
        onClick={() => {
          setReady(false);
          setFailed(false);
          setPreferTradingView((value) => !value);
        }}
      >
        {preferTradingView ? "Show exchange chart" : "View TradingView chart"}
      </button>
      {!showWidget && (
        <div className={s.fallback}>
          {data ? (
            <>
              <div className={s.quote}>
                <strong>
                  {data.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <small> USDT</small>
                </strong>
                <span
                  className={data.changePercent < 0 ? s.negative : s.positive}
                >
                  {data.changePercent > 0 ? "+" : ""}
                  {data.changePercent.toFixed(2)}% <small>24h</small>
                </span>
              </div>
              <svg
                viewBox="0 0 300 140"
                role="img"
                aria-label={`${asset} past day price chart`}
              >
                <defs>
                  <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#31e6ff" stopOpacity=".22" />
                    <stop offset="1" stopColor="#31e6ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,140 ${points} 300,140`}
                  fill={`url(#${gradient})`}
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke="#31e6ff"
                  strokeWidth="2"
                />
              </svg>
              <div className={s.source}>
                Binance · {asset}/USDT ·{" "}
                {data.stale || dataError ? "Last available update" : "Updated"}{" "}
                {new Date(data.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </>
          ) : (
            <div className={s.placeholder} role="status">
              <FiActivity />
              <span>
                {dataError
                  ? "Market connection unavailable"
                  : "Loading market prices…"}
              </span>
              <small>
                {dataError
                  ? "Please retry the market connection."
                  : "Connecting to market providers."}
              </small>
            </div>
          )}
          {(failed || dataError) && (
            <button className={s.retry} onClick={retry}>
              <FiRefreshCw />
              {data ? "Retry TradingView" : "Retry connection"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
