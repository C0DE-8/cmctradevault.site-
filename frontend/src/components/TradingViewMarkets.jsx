import { FiArrowUpRight, FiActivity } from "react-icons/fi";
import MarketChart from "./MarketChart";
import s from "./TradingViewMarkets.module.css";
const markets = [
  {
    name: "Bitcoin",
    symbol: "COINBASE:BTCUSD",
    ticker: "BTC / USDT",
    label: "The original digital asset",
  },
  {
    name: "Ethereum",
    symbol: "COINBASE:ETHUSD",
    ticker: "ETH / USDT",
    label: "A world of decentralized possibilities",
  },
  {
    name: "Solana",
    symbol: "COINBASE:SOLUSD",
    ticker: "SOL / USDT",
    label: "The next generation of digital assets",
  },
];
export default function TradingViewMarkets() {
  return (
    <div className={s.markets}>
      <div className={s.bar}>
        <span>
          <FiActivity /> THE MARKET, IN MOTION
        </span>
        <span>Live exchange data · TradingView charts</span>
      </div>
      <div className={s.cards}>
        {markets.map(({ name, symbol, ticker, label }, index) => (
          <article
            key={symbol}
            className={s.card}
            aria-label={`${name} market chart`}
          >
            <header>
              <span className={s.index}>0{index + 1}</span>
              <div>
                <h3>{name}</h3>
                <span>{ticker}</span>
              </div>
              <a
                href={`https://www.tradingview.com/symbols/${symbol.replace(":", "-")}/`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${name} on TradingView`}
              >
                <FiArrowUpRight />
              </a>
            </header>
            <div className={s.chart}>
              <MarketChart symbol={symbol} asset={ticker.split(" / ")[0]} />
            </div>
            <footer>
              <span>{label}</span>
              <a
                href={`https://www.tradingview.com/symbols/${symbol.replace(":", "-")}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                TradingView <FiArrowUpRight />
              </a>
            </footer>
          </article>
        ))}
      </div>
      <div className={s.note}>
        <span>
          TradingView charts use USD pairs. Backup quotes are Binance USDT
          pairs, labeled on each chart. Availability and delays depend on the
          provider.
        </span>
      </div>
    </div>
  );
}
