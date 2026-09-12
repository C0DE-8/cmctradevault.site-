import { Link } from "react-router-dom";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import { Brand } from "../components/UI";
import s from "./Policy.module.css";

export default function Policy() {
  return (
    <main className={s.page}>
      <header>
        <Brand />
        <Link to="/">
          <FiArrowLeft /> Back to home
        </Link>
      </header>
      <article>
        <span className={s.eyebrow}>
          VALTHERA INVESTMENTS · LAST UPDATED SEPTEMBER 2026
        </span>
        <h1>Terms, risk &amp; investment policy.</h1>
        <p className={s.lead}>
          Valthera gives you a clearer way to explore markets and manage your
          own decisions. It is not a promise of wealth, a deposit account, or
          personal financial advice.
        </p>
        <div className={s.notice}>
          <FiShield />
          <p>
            <strong>Take responsibility for your next move.</strong>
            <br />
            Digital assets and trading can lose value quickly. Never commit
            money you need for living expenses, debt, or emergencies.
          </p>
        </div>
        <Section title="1. What Valthera provides">
          Valthera Investments provides software for viewing market information,
          recording user-directed investment activity, and exploring digital
          asset strategies. Market data can be delayed, interrupted, or wrong.
          Practice trading features use test funds and do not place exchange
          orders.
        </Section>
        <Section title="2. Risk disclosure">
          Investing and trading involve substantial risk, including partial or
          total loss of capital, price volatility, liquidity risk, technology
          failures, cyber incidents, and regulatory changes. Past performance,
          displayed rates, signals, accuracy figures, progress indicators, and
          projections do not predict future results. Returns are not guaranteed.
          You alone decide whether an activity fits your circumstances and risk
          tolerance.
        </Section>
        <Section title="3. No financial promise or advice">
          Information on this site is general education and product information,
          not financial, tax, legal, or investment advice. No employee,
          indicator, plan, copy-trading profile, or interface message guarantees
          profit. Consider speaking with an appropriately qualified independent
          adviser before committing funds.
        </Section>
        <Section title="4. Use of the account">
          You must provide accurate information, protect your credentials, and
          use only funds you are authorized to use. You must be legally
          permitted to access these services where you live. We may pause
          features, reject requests, or close access when required by law,
          security controls, identity checks, platform rules, or suspected
          misuse.
        </Section>
        <Section title="5. Funding, withdrawals &amp; records">
          A displayed balance is a platform record and is not a bank deposit or
          proof of an external blockchain transfer. Funding requests may require
          review and evidence. Withdrawals are subject to available funds,
          holds, verification, processing conditions, and applicable law.
          Administrative ledger corrections are recorded with a reason and audit
          trail.
        </Section>
        <Section title="6. Responsible participation">
          Do not chase losses, borrow to trade, use excessive leverage, or make
          decisions under pressure. Set a personal budget and stop when it is
          reached. A good strategy includes patience, diversification, and
          accepting that some decisions will lose money. If trading is affecting
          your wellbeing or finances, stop and seek independent support.
        </Section>
        <Section title="7. Acceptance and changes">
          By creating an account or submitting an investment or trading request,
          you confirm that you have read this policy, understand the risks, and
          accept the applicable platform terms. We may update these terms;
          material changes will be presented before continued use where
          appropriate. The effective version is the one shown when you act.
        </Section>
        <p className={s.footer}>
          Questions about these terms? Contact the platform administrator
          through your account. <Link to="/register">Create an account</Link> ·{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </article>
    </main>
  );
}
function Section({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{children}</p>
    </section>
  );
}
