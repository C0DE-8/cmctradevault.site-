import { useEffect } from "react";
import s from "./SitePreloader.module.css";

export default function SitePreloader({ onReady }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onReady(true), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 350);
    return () => window.clearTimeout(timer);
  }, [onReady]);
  return <div className={s.loader} role="status" aria-label="Loading CMC TradeVault"><div className={s.brand}><span>⬡</span><strong>CMC<small>TRADEVAULT</small></strong></div><p>Opening your secure workspace…</p><div className={s.line} /></div>;
}
