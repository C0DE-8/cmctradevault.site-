import { assets } from "../constants/assets";
import s from "./AssetBalances.module.css";
export default function AssetBalances({ balances = {} }) {
  return (
    <div className={s.grid}>
      {assets.map((asset) => (
        <article key={asset}>
          <span className={s.coin}>{asset.slice(0, 1)}</span>
          <div>
            <h3>{asset}</h3>
            <p>
              {balances[asset] ?? "0.00000000"} <small>{asset}</small>
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
