import { useEffect } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import s from "./SitePreloader.module.css";

export default function SitePreloader({ onReady }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onReady(true), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 350);
    return () => window.clearTimeout(timer);
  }, [onReady]);
  return <div className={s.loader} role="status" aria-label="Loading Valthera Investments"><div className={s.brand}><span><FiArrowUpRight /></span><strong>Valthera<small>Investments</small></strong></div><p>Loading your next chapter…</p><div className={s.line} /></div>;
}
