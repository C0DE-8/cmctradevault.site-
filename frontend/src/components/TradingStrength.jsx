import { FiActivity, FiTrendingUp } from "react-icons/fi";
import s from "./TradingStrength.module.css";
export default function TradingStrength({ user }) {
  const strength = Math.max(
      0,
      Math.min(100, Number(user?.signal_strength) || 0),
    ),
    progress = Math.max(0, Math.min(100, Number(user?.trade_progress) || 0));
  return (
    <section className={s.panel} aria-label="Account trading strength">
      <div className={s.top}>
        <span>
          <FiActivity />
          Trading strength
        </span>
        <span className={s.status}>{user?.trading_status || "Not set"}</span>
      </div>
      <div className={s.main}>
        <div>
          <strong>
            {strength.toFixed(0)}
            <small>/100</small>
          </strong>
          <p>Account signal strength</p>
        </div>
        <div
          className={s.bars}
          role="meter"
          aria-label="Signal strength"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={strength}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <i
              key={i}
              className={strength > i * 5 ? s.lit : ""}
              style={{ height: 15 + i * 2 }}
            />
          ))}
        </div>
      </div>
      <div className={s.progress}>
        <span>
          <FiTrendingUp />
          Trade progress
        </span>
        <strong>{progress.toFixed(0)}%</strong>
      </div>
      <div className={s.track}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className={s.note}>
        Account indicators set by the platform. These are not market forecasts
        or guarantees of returns.
      </p>
    </section>
  );
}
