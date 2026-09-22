import { useId } from "react";
import { FiAlertCircle, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import s from "./UI.module.css";
export function Brand() {
  return (
    <Link to="/" className={s.brand} aria-label="CMC TradeVault home">
      <span className={s.mark}>
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 27 9.5v13L16 29 5 22.5v-13L16 3Z"/><path d="m11 12 5-3 5 3v7l-5 3-5-3v-7Z"/><circle cx="16" cy="15.5" r="2"/></svg>
      </span>
      <span className={s.wordmark}>
        <span>CMC</span><span className={s.light}>TRADEVAULT</span>
      </span>
      <span className={s.dot}>●</span>
    </Link>
  );
}
export function Button({ children, to, secondary, ...props }) {
  const cls = `${s.button} ${secondary ? s.secondary : ""}`;
  return to ? (
    <Link className={cls} to={to} {...props}>
      {children}
    </Link>
  ) : (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
export function Heading({ eyebrow, title, children, action }) {
  return (
    <div className={s.heading}>
      <div>
        {eyebrow && <span className={s.eyebrow}>{eyebrow}</span>}
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
      {action}
    </div>
  );
}
export function Status({ loading, error, retry }) {
  return loading ? (
    <div className={s.status} role="status">
      <span className={s.spinner} />
      Loading your account…
    </div>
  ) : error ? (
    <div className={s.error} role="alert">
      <FiAlertCircle />
      {error}
      {retry && <button onClick={retry}>Try again</button>}
    </div>
  ) : null;
}
export function Empty({ children = "Your activity will appear here." }) {
  return (
    <div className={s.empty}>
      <FiArrowUpRight />
      <h3>A fresh start.</h3>
      <p>{children}</p>
    </div>
  );
}
export function Field({ label, name, as, children, ...props }) {
  const Tag = as || "input";
  return (
    <label className={s.field}>
      <span>{label}</span>
      <Tag name={name} {...props}>
        {children}
      </Tag>
    </label>
  );
}
export function ArrowLink({ to, children }) {
  return (
    <Link className={s.arrowLink} to={to}>
      {children}
      <FiArrowRight />
    </Link>
  );
}
export function Chart({ small = false }) {
  const gradientId = useId();
  return (
    <svg
      className={small ? s.smallChart : s.chart}
      viewBox="0 0 600 190"
      role="img"
      aria-label="Illustrative portfolio growth chart"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#31e6ff" stopOpacity=".3" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {!small &&
        [35, 85, 135, 185].map((y) => (
          <path
            key={y}
            d={`M0 ${y}H600`}
            stroke="#ffffff0b"
            strokeDasharray="4 5"
          />
        ))}
      <path
        d="M0 164 L20 157 L36 167 L56 139 L72 148 L89 130 L107 135 L125 115 L140 125 L160 121 L179 143 L199 117 L216 110 L236 121 L251 89 L270 102 L293 88 L310 96 L330 64 L350 74 L372 60 L390 77 L409 53 L430 65 L449 35 L468 43 L490 31 L512 51 L530 22 L550 32 L570 16 L600 7 L600 190 L0 190Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M0 164 L20 157 L36 167 L56 139 L72 148 L89 130 L107 135 L125 115 L140 125 L160 121 L179 143 L199 117 L216 110 L236 121 L251 89 L270 102 L293 88 L310 96 L330 64 L350 74 L372 60 L390 77 L409 53 L430 65 L449 35 L468 43 L490 31 L512 51 L530 22 L550 32 L570 16 L600 7"
        fill="none"
        stroke="#31e6ff"
        strokeWidth="2.5"
      />
    </svg>
  );
}
