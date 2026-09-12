import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiActivity, FiCpu, FiPause, FiPlay, FiArrowRight, FiMessageCircle } from "react-icons/fi";
import { Button, ArrowLink } from "./UI";
import { getMarket } from "../api/tradingView";
import s from "../pages/Landing.module.css";

const coins = [["BTC", "Bitcoin"], ["ETH", "Ethereum"], ["SOL", "Solana"], ["XRP", "XRP"], ["ADA", "Cardano"], ["DOGE", "Dogecoin"], ["AVAX", "Avalanche"], ["LINK", "Chainlink"]];
export function CoinTicker({ compact = false }) {
  const [paused, setPaused] = useState(false);
  const [quotes, setQuotes] = useState({});
  useEffect(() => {
    if (compact) return;
    let active = true, busy = false;
    const controller = new AbortController();
    async function refresh() {
      if (busy || document.hidden) return;
      busy = true;
      const results = await Promise.allSettled(coins.map(([symbol]) => getMarket(symbol, controller.signal)));
      if (active) setQuotes(Object.fromEntries(results.map((r, i) => [coins[i][0], r.status === "fulfilled" ? r.value : null])));
      busy = false;
    }
    refresh();
    const timer = setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", refresh);
    return () => { active = false; controller.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, [compact]);
  return <div className={`${s.ticker} ${compact ? s.compactTicker : ""}`} aria-label={compact ? "Explore digital assets" : "Cryptocurrency market ticker"}>
    <div className={s.tickerLabel}><FiActivity /><span>{compact ? "MORE TO EXPLORE" : "MARKET PULSE"}<small>{compact ? "A world of digital assets" : "Binance · USDT · 24h change"}</small></span><button onClick={() => setPaused(!paused)} aria-label={paused ? "Resume coin ticker" : "Pause coin ticker"} aria-pressed={paused}>{paused ? <FiPlay /> : <FiPause />}</button></div>
    <div className={s.tickerWindow}><div className={s.tickerTrack} style={{ animationPlayState: paused ? "paused" : undefined }}>
      {[0, 1].map(copy => <div className={s.tickerGroup} key={copy} aria-hidden={copy === 1 ? true : undefined}>{coins.map(([symbol, name]) => {
        const q = quotes[symbol];
        return <div className={s.coinQuote} key={symbol}><span className={s.coinMonogram}>{symbol === "BTC" ? "₿" : symbol.slice(0, 1)}</span><span><strong>{name}</strong><small>{symbol}{q?.stale ? " · delayed" : ""}</small></span>{!compact && <span className={s.quoteNumbers}>{q ? <><strong>{q.price.toLocaleString("en-US", { maximumFractionDigits: q.price < 1 ? 4 : 2, minimumFractionDigits: 2 })}</strong><small className={q.changePercent < 0 ? s.negative : s.positive}>{q.changePercent >= 0 ? "+" : ""}{q.changePercent.toFixed(2)}%</small></> : <small>Quote unavailable</small>}</span>}</div>;
      })}</div>)}
    </div></div>
  </div>;
}

const routes = [
  { name: "Market trading", tag: "YOUR VIEW. YOUR NEXT MOVE.", title: "From market insight to a considered trade.", text: "Follow Bitcoin, Ethereum, and Solana with market charts. Review the instrument, direction, and amount before submitting a supported trade from your account.", points: ["Explore price action and chart indicators", "Review trade details before you confirm", "Keep open positions and trade history together"], to: "/app/trading", action: "Explore trading", steps: ["Choose a market", "Review your position", "Follow your trade"] },
  { name: "Binary practice", tag: "LEARN THE FLOW", title: "A clearer way to understand up or down.", text: "Explore how timed directional contracts work in the local practice environment. Compare entry and expiry prices, and see how a contract settles.", points: ["Choose a direction and expiry", "Review the stake and possible outcome", "Practice availability is limited to the local test environment"], to: "/preview", action: "Preview the platform", steps: ["Choose a direction", "Set a practice expiry", "Review the outcome"] },
  { name: "Copy trading", tag: "A DIFFERENT PERSPECTIVE", title: "Explore another approach. Make your own decision.", text: "Browse available trader profiles and review their displayed performance and terms before submitting a copy request. Past results do not predict future performance.", points: ["Compare available trader profiles", "Review your copy request before submitting", "Track your copy status from your dashboard"], to: "/app/copy-trading", action: "Explore copy trading", steps: ["Explore profiles", "Review the details", "Manage your copy status"] },
];
export function TradingRoutes() {
  const [selected, setSelected] = useState(0);
  const route = routes[selected];
  return <section className={s.section} id="trading"><div className={s.sectionHeading}><div><span className={s.eyebrow}>YOUR MARKET ROUTER</span><h2>More than one way<br />to make your next move.</h2></div><p>Find the tools that fit your approach.<br />Understand the details before you begin.</p></div>
    <div className={s.routePanel}><div className={s.routeTabs} aria-label="Trading approaches">{routes.map((r, i) => <button key={r.name} aria-pressed={selected === i} onClick={() => setSelected(i)}>{r.name}<FiArrowUpRight /></button>)}</div><div className={s.routeBody}><div><span className={s.eyebrow}>{route.tag}</span><h3>{route.title}</h3><p>{route.text}</p><ul>{route.points.map(p => <li key={p}>{p}</li>)}</ul><Button to={route.to}>{route.action}<FiArrowUpRight /></Button></div><div className={s.routeDiagram}><span className={s.diagramLabel}>A LITTLE CLARITY AT EVERY STEP</span>{route.steps.map((step, i) => <div key={step}><span>0{i + 1}</span><strong>{step}</strong><FiArrowRight /></div>)}<small>Explore → review → decide</small></div></div></div>
  </section>;
}

function NewsFeed() {
  const ref = useRef(null);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const host = ref.current;
    let cleanup = () => {};
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const wrapper = document.createElement("div");
      wrapper.style.height = "100%";
      const target = document.createElement("div");
      target.className = "tradingview-widget-container__widget";
      wrapper.appendChild(target);
      host.appendChild(wrapper);
      let active = true;
      const timeout = setTimeout(() => { if (active) setStatus("error"); }, 18000);
      const mutation = new MutationObserver(() => {
        const frame = wrapper.querySelector("iframe");
        if (!frame) return;
        frame.title = "Bitcoin news from TradingView";
        frame.addEventListener("load", () => { if (active) { clearTimeout(timeout); setStatus("ready"); } }, { once: true });
        mutation.disconnect();
      });
      mutation.observe(wrapper, { childList: true, subtree: true });
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.async = true;
      script.textContent = JSON.stringify({ feedMode: "symbol", symbol: "BITSTAMP:BTCUSD", colorTheme: "dark", isTransparent: true, displayMode: "regular", width: "100%", height: "100%", locale: "en" });
      script.onerror = () => { if (active) { clearTimeout(timeout); setStatus("error"); } };
      wrapper.appendChild(script);
      cleanup = () => { active = false; clearTimeout(timeout); mutation.disconnect(); wrapper.remove(); };
    }, { rootMargin: "200px" });
    observer.observe(host);
    return () => { observer.disconnect(); cleanup(); };
  }, []);
  return <div className={s.newsFeedWrap}><div ref={ref} className={s.newsFeed} />{status !== "ready" && <div className={s.newsStatus} role="status">{status === "loading" ? "Connecting to Bitcoin headlines…" : "The news feed is temporarily unavailable."}<a href="https://www.tradingview.com/symbols/BTCUSD/news/" target="_blank" rel="noreferrer">Read Bitcoin news on TradingView <FiArrowUpRight /></a></div>}</div>;
}
export function BitcoinNews() {
  return <section className={s.section} id="news"><div className={s.sectionHeading}><div><span className={s.eyebrow}>BEYOND THE PRICE</span><h2>A little context.<br />A clearer perspective.</h2></div><p>Bitcoin headlines from TradingView.<br />Follow the story behind the market.</p></div><div className={s.newsLayout}><NewsFeed /><aside className={s.newsAside}><span className={s.eyebrow}>THE BITCOIN BRIEF</span><h3>Read the news.<br />Then read the market.</h3><p>Put a headline in context before making your next move.</p>{[["01", "Check the source", "Look for the original report and its publication date."], ["02", "Zoom out", "Compare short-term moves with a longer chart timeframe."], ["03", "Know your exposure", "Review the amount and possible loss before placing a trade."]].map(([n, title, text]) => <div key={n}><span>{n}</span><div><strong>{title}</strong><p>{text}</p></div></div>)}<a href="https://www.tradingview.com/symbols/BTCUSD/news/" target="_blank" rel="noreferrer">Bitcoin news on TradingView <FiArrowUpRight /></a></aside></div></section>;
}

export function MiningSection() {
  const [power, setPower] = useState(100);
  return <section className={s.section} id="mining"><div className={s.miningPanel}><div className={s.miningCopy}><span className={s.eyebrow}>THE NEXT CHAPTER · MINING</span><h2>Another way to<br />explore crypto.</h2><p>A dedicated home for crypto mining is planned for Valthera. Get to know the essentials now, from computing power to the costs behind it.</p><span className={s.availability}>Coming soon · Mining is not active</span><div className={s.miningFacts}><div><FiCpu /><strong>Understand hash power</strong><p>Hash rate measures the computing work a miner can perform.</p></div><div><FiActivity /><strong>Look beyond rewards</strong><p>Electricity, equipment, pool fees, and network difficulty all matter.</p></div></div><a href="https://bitcoin.org/en/how-it-works" target="_blank" rel="noreferrer">Learn how Bitcoin mining works <FiArrowUpRight /></a></div><div className={s.miningPreview}><div className={s.previewTop}><FiCpu /><span>MINING EXPLORER</span><small>ILLUSTRATION</small></div><div className={s.miningArt} aria-hidden="true">{[0,1,2].map(n => <div key={n}><span /><i /><i /><b>V / 0{n+1}</b></div>)}</div><h3>See what power costs.</h3><p>Try an electricity cost example. This is not an earnings estimate.</p><label htmlFor="mining-power">Equipment power <strong>{power.toLocaleString()} W</strong></label><input id="mining-power" type="range" min="100" max="5000" step="100" value={power} onChange={e => setPower(Number(e.target.value))} /><div className={s.costResult}><span>Estimated electricity / day<small>24 hours at an illustrative $0.10 / kWh</small></span><strong>${(power / 1000 * 24 * .1).toFixed(2)}</strong></div><small>No equipment is connected. No coins are being mined.</small></div></div></section>;
}

export function CommunitySection() {
  return <section className={s.section} id="testimonials"><div className={s.sectionHeading}><div><span className={s.eyebrow}>THE PEOPLE BEHIND THE PROGRESS</span><h2>Your experience.<br />Our next chapter.</h2></div><p>A space for real voices from our community.</p></div><div className={s.communityPanel}><div className={s.communityIcon}><FiMessageCircle /></div><div><span className={s.eyebrow}>COMMUNITY TESTIMONIALS</span><h3>Real stories deserve a real place.</h3><p>Verified customer stories will appear here as they become available. In the meantime, explore the platform and form your own first impression.</p></div><ArrowLink to="/preview">Take a look inside</ArrowLink></div></section>;
}
