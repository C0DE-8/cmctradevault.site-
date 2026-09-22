import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiArrowRight,
  FiLayers,
  FiShield,
  FiPlus,
  FiMinus,
  FiMenu,
  FiX,
  FiActivity,
  FiCheck,
  FiPause,
  FiPlay,
  FiLock,
  FiZap,
  FiGlobe,
  FiChevronLeft,
  FiChevronRight,
  FiPieChart,
  FiRefreshCw,
} from "react-icons/fi";
import { SiBitcoin, SiEthereum } from "react-icons/si";
import { Brand, Button, ArrowLink } from "../components/UI";
import s from "./Landing.module.css";
import HeroMarketCard from "../components/HeroMarketCard";
import TradingViewMarkets from "../components/TradingViewMarkets";
import SitePreloader from "../components/SitePreloader";
import { CoinTicker, TradingRoutes, BitcoinNews, MiningSection, CommunitySection } from "../components/LandingExtras";
export default function Landing() {
  const [menu, setMenu] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [showcase, setShowcase] = useState(0);
  const showcaseSlides = [
    { tag: "01 · COMMAND CENTER", title: "Your entire portfolio, in one clear view.", text: "Follow balances, active strategies, recent activity, and market movement without losing the bigger picture.", metric: "$48,294.80", label: "Portfolio value", change: "+12.4%", icon: FiPieChart, bars: [34, 45, 40, 58, 52, 70, 64, 83, 78, 96] },
    { tag: "02 · MARKET INTELLIGENCE", title: "See the signal before your next move.", text: "Explore focused market data, chart context, and asset performance from a workspace designed to reduce noise.", metric: "24 / 7", label: "Market access", change: "LIVE", icon: FiActivity, bars: [76, 58, 63, 48, 56, 42, 60, 68, 81, 92] },
    { tag: "03 · STRATEGY HUB", title: "Put every strategy on the same map.", text: "Compare investments, trading positions, and copy activity with clear status updates and a unified history.", metric: "3", label: "Active strategies", change: "SYNCED", icon: FiRefreshCw, bars: [28, 38, 52, 48, 65, 59, 72, 68, 86, 94] },
  ];
  const activeShowcase = showcaseSlides[showcase];
  const ShowcaseIcon = activeShowcase.icon;
  return (
    <>
      {!ready && <SitePreloader onReady={setReady} />}
      <div className={s.page} inert={!ready}>
        <div className={s.announcement}>
          <span className={s.liveDot} /> DIGITAL MARKETS. SECURED BY DESIGN.{" "}
          <Link to="/register">
            Meet your next chapter <FiArrowUpRight />
          </Link>
        </div>
        <header className={s.header}>
          <Brand />
          <nav className={menu ? s.open : ""}>
            <a href="#possibilities" onClick={() => setMenu(false)}>
              Why TradeVault
            </a>
            <a href="#markets" onClick={() => setMenu(false)}>
              Explore markets
            </a>
            <a href="#how-it-works" onClick={() => setMenu(false)}>
              How it works
            </a>
            <a href="#mining" onClick={() => setMenu(false)}>Mining</a>
            <a href="#news" onClick={() => setMenu(false)}>News</a>
            <a href="#faq" onClick={() => setMenu(false)}>
              FAQs
            </a>
          </nav>
          <div className={s.navActions}>
            <Link to="/login">Log in</Link>
            <Button to="/register">
              Get started <FiArrowUpRight />
            </Button>
            <button
              className={s.menuButton}
              onClick={() => setMenu(!menu)}
              aria-label="Toggle navigation"
              aria-expanded={menu}
            >
              {menu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </header>
        <main>
          <section className={s.hero}>
            <div className={s.heroCopy}>
              <div className={s.pill}>
                <span />
                THE NEW LAYER FOR DIGITAL WEALTH
              </div>
              <h1>
                Trade the future.
                <br />Secure the <span>edge.</span>
              </h1>
              <p>
                Track digital markets, deploy strategies, and manage every asset
                from one intelligent vault built for the always-on economy.
              </p>
              <div className={s.heroActions}>
                <Button to="/register">
                  Enter TradeVault <FiArrowUpRight />
                </Button>
                <ArrowLink to="/preview">Explore the platform</ArrowLink>
              </div>
              <div className={s.heroNote}>
                <FiShield /> Secure portfolio infrastructure <span>•</span>{" "}
                Markets live 24/7
              </div>
            </div>
            <div
              className={`${s.heroVisual} ${motionPaused ? s.motionPaused : ""}`}
            >
              <div className={s.orbit} aria-hidden="true">
                <span className={s.orbitTrail} />
              </div>
              <div className={s.orbitTwo} aria-hidden="true">
                <span className={s.orbitTrail} />
              </div>
              <div className={s.grid} aria-hidden="true" />
              <img className={s.vaultArtwork} src="/cmc-vault-hero.png" alt="" />
              <button
                type="button"
                className={s.motionToggle}
                onClick={() => setMotionPaused((p) => !p)}
                aria-label={
                  motionPaused
                    ? "Resume hero animation"
                    : "Pause hero animation"
                }
                aria-pressed={motionPaused}
              >
                {motionPaused ? <FiPlay /> : <FiPause />}
              </button>
              <div className={s.floatEth} aria-hidden="true">
                <SiEthereum />
              </div>
              <div className={s.floatBtc} aria-hidden="true">
                <SiBitcoin />
              </div>
              <div className={s.portfolio}>
                <HeroMarketCard />
              </div>
              <div className={s.floatingCard}>
                <span className={s.check}>
                  <FiCheck />
                </span>
                <div>
                  Your next chapter starts here
                  <small>A little progress. Every day.</small>
                </div>
                <FiArrowUpRight />
              </div>
            </div>
          </section>
          <CoinTicker />
          <section className={s.section} id="possibilities">
            <div className={s.sectionHeading}>
              <div>
                <span className={s.eyebrow}>BUILT AROUND YOU</span>
                <h2>
                  Your ambitions.
                  <br />
                  Meet your possibilities.
                </h2>
              </div>
              <p>
                From your first investment to your next big move.
                <br />
                The tools to move forward, all together.
              </p>
            </div>
            <div className={s.features}>
              <article>
                <div className={s.featureIcon}>
                  <FiLayers />
                </div>
                <span className={s.number}>01 /</span>
                <h3>One home for your portfolio</h3>
                <p>
                  See your balances, investments, and transaction history in one
                  thoughtfully designed space.
                </p>
                <ArrowLink to="/preview">Find your perspective</ArrowLink>
                <div className={s.stackArt}>
                  <div>
                    <SiBitcoin />
                    <span>Bitcoin</span>
                    <b>BTC</b>
                  </div>
                  <div>
                    <SiEthereum />
                    <span>Ethereum</span>
                    <b>ETH</b>
                  </div>
                </div>
              </article>
              <article>
                <div className={s.featureIcon}>
                  <FiActivity />
                </div>
                <span className={s.number}>02 /</span>
                <h3>A strategy that fits you</h3>
                <p>
                  Explore investment plans and copy trading. Compare the details
                  before choosing your next step.
                </p>
                <ArrowLink to="/register">Explore your options</ArrowLink>
                <div className={s.bars}>
                  {[25, 36, 32, 52, 44, 65, 57, 79, 71, 95, 87, 110].map(
                    (h, i) => (
                      <i key={i} style={{ height: h }} />
                    ),
                  )}
                </div>
              </article>
              <article>
                <div className={s.featureIcon}>
                  <FiShield />
                </div>
                <span className={s.number}>03 /</span>
                <h3>Clarity at every step</h3>
                <p>
                  Track deposit and withdrawal requests, verify your identity,
                  and stay connected to your account.
                </p>
                <ArrowLink to="/register">Make yourself at home</ArrowLink>
                <div className={s.shieldArt}>
                  <div>
                    <FiShield />
                    <FiCheck />
                  </div>
                  <span>YOUR ACCOUNT. YOUR OVERVIEW.</span>
                </div>
              </article>
            </div>
          </section>
          <TradingRoutes />
          <section className={s.section} id="markets">
            <div className={s.sectionHeading}>
              <div>
                <span className={s.eyebrow}>EXPAND YOUR HORIZONS</span>
                <h2>A world that never stands still.</h2>
              </div>
              <ArrowLink to="/register">Explore investments</ArrowLink>
            </div>
            <TradingViewMarkets />
          </section>
          <section className={`${s.section} ${s.showcaseSection}`} id="platform">
            <div className={s.sectionHeading}>
              <div><span className={s.eyebrow}>INSIDE THE VAULT</span><h2>One platform.<br />Every decisive view.</h2></div>
              <div className={s.slideControls}>
                <button onClick={() => setShowcase((showcase - 1 + showcaseSlides.length) % showcaseSlides.length)} aria-label="Previous platform view"><FiChevronLeft /></button>
                <span aria-live="polite">0{showcase + 1} / 0{showcaseSlides.length}</span>
                <button onClick={() => setShowcase((showcase + 1) % showcaseSlides.length)} aria-label="Next platform view"><FiChevronRight /></button>
              </div>
            </div>
            <div className={s.showcasePanel}>
              <div className={s.showcaseCopy} key={`${showcase}-copy`}>
                <span className={s.eyebrow}>{activeShowcase.tag}</span>
                <h3>{activeShowcase.title}</h3><p>{activeShowcase.text}</p>
                <ArrowLink to="/preview">Open platform preview</ArrowLink>
                <div className={s.slideDots}>{showcaseSlides.map((slide, i) => <button key={slide.tag} onClick={() => setShowcase(i)} aria-label={`Show ${slide.title}`} aria-pressed={showcase === i} />)}</div>
              </div>
              <div className={s.productWindow} key={`${showcase}-window`}>
                <div className={s.windowTop}><span><i /><i /><i /></span><b>TRADEVAULT / OVERVIEW</b><small>SECURE SESSION</small></div>
                <div className={s.windowBody}>
                  <div className={s.windowMetric}><span><ShowcaseIcon /> {activeShowcase.label}</span><strong>{activeShowcase.metric}</strong><small>{activeShowcase.change}</small></div>
                  <div className={s.windowChart}><span>PERFORMANCE</span><div>{activeShowcase.bars.map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></div>
                  <div className={s.windowRows}>{["Bitcoin / BTC", "Ethereum / ETH", "Solana / SOL"].map((asset, i) => <div key={asset}><span className={s.assetOrb}>{asset[0]}</span><strong>{asset}</strong><small>{["+2.48%", "+1.16%", "+4.02%"][i]}</small></div>)}</div>
                </div>
              </div>
            </div>
          </section>
          <section className={`${s.section} ${s.securitySection}`}>
            <div className={s.securityLead}>
              <span className={s.eyebrow}>TRUST, BUILT INTO THE EXPERIENCE</span>
              <h2>Designed to keep clarity in—and uncertainty out.</h2>
              <p>Security is more than a badge. It is a series of thoughtful controls, visible account activity, and review steps around important actions.</p>
              <Button to="/register">Create a secure account <FiArrowUpRight /></Button>
            </div>
            <div className={s.securityGrid}>
              <article className={s.securityPrimary}><FiLock /><span>ACCOUNT PROTECTION</span><h3>Control starts with verification.</h3><p>Identity checks and account review help keep your workspace connected to you.</p><div className={s.securityRings}><i /><i /><b><FiCheck /></b></div></article>
              <article><FiActivity /><span>VISIBLE ACTIVITY</span><h3>Every request has a status.</h3><p>Follow deposits, withdrawals, and account activity from one history.</p></article>
              <article><FiGlobe /><span>ALWAYS-ON VIEW</span><h3>Built for global markets.</h3><p>Watch supported assets and your workspace across devices.</p></article>
            </div>
          </section>
          <section className={`${s.section} ${s.ecosystemSection}`}>
            <div className={s.ecosystemHeader}><span className={s.eyebrow}>YOUR TRADEVAULT ECOSYSTEM</span><h2>Start focused.<br />Expand when you’re ready.</h2><p>Build a workspace around the way you want to engage with digital markets.</p></div>
            <div className={s.ecosystemRail}>
              {[{n:"01",icon:FiPieChart,title:"Build your core",text:"Fund your account and bring your balances into one organized portfolio view."},{n:"02",icon:FiActivity,title:"Read the market",text:"Explore supported assets, price movement, and chart context before acting."},{n:"03",icon:FiZap,title:"Choose a strategy",text:"Compare investment, trading, and copy options with their details in view."},{n:"04",icon:FiRefreshCw,title:"Stay in control",text:"Review activity, follow status updates, and adjust your next move over time."}].map(({n,icon:Icon,title,text}) => <article key={n}><div><span>{n}</span><Icon /></div><h3>{title}</h3><p>{text}</p><FiArrowRight /></article>)}
            </div>
          </section>
          <BitcoinNews />
          <MiningSection />
          <CoinTicker compact />
          <CommunitySection />
          <section className={`${s.section} ${s.steps}`} id="how-it-works">
            <div>
              <span className={s.eyebrow}>SMALL STEPS. NEW POSSIBILITIES.</span>
              <h2>
                Your future starts
                <br />
                with a first step.
              </h2>
              <Button to="/register">
                Let’s get started <FiArrowUpRight />
              </Button>
            </div>
            <div className={s.stepsList}>
              {[
                [
                  "Create your account",
                  "A few details to get you started. Your own space to see the bigger picture.",
                ],
                [
                  "Make it yours",
                  "Verify your identity and fund your account with the available deposit methods.",
                ],
                [
                  "Find your next move",
                  "Explore plans, review the terms, and follow your investments in one place.",
                ],
              ].map(([title, text], i) => (
                <div key={title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <FiArrowUpRight />
                </div>
              ))}
            </div>
          </section>
          <section className={`${s.section} ${s.faq}`} id="faq">
            <div>
              <span className={s.eyebrow}>A LITTLE MORE CLARITY</span>
              <h2>
                Good questions.
                <br />
                Straight answers.
              </h2>
              <p>Get to know your next investment space.</p>
            </div>
            <div>
              {[
                [
                  "What can I do with CMC TradeVault?",
                  "Manage your account, explore investment plans, follow copy traders, place supported trades, and track deposit and withdrawal requests from your dashboard.",
                ],
                [
                  "Can I mine crypto on CMC TradeVault today?",
                  "Mining is planned and is not active yet. The mining explorer is an illustration of a proposed rewards model ($0.10 per hour per 100 W), not a connected miner or a promise of rewards. Availability and terms will be shared before launch.",
                ],
                [
                  "Are the news and prices live?",
                  "Market quotes come from Binance and refresh approximately every minute. Bitcoin headlines are provided by TradingView. Provider delays and outages can occur; unavailable or delayed quotes are labeled.",
                ],
                [
                  "How do I fund my account?",
                  "After signing in, open Wallet, choose an available asset, and use the deposit address displayed for that asset. Submit your amount and payment proof for review.",
                ],
                [
                  "Are investment returns guaranteed?",
                  "No. Investments and digital assets carry risk, including the loss of capital. Review every plan’s terms and make decisions that suit your circumstances.",
                ],
                [
                  "Is this a self-custody Web3 wallet?",
                  "No. CMC TradeVault is an account-based investment platform. The dashboard uses the platform’s balances and deposit addresses; it does not connect to or control a self-custody wallet.",
                ],
              ].map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <FiPlus className={s.plus} />
                    <FiMinus className={s.minus} />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
          <section className={s.cta}>
            <div className={s.ctaGlow} />
            <span className={s.eyebrow}>THE NEXT CHAPTER IS YOURS</span>
            <h2>
              Think forward.
              <br />
              <span>Start here.</span>
            </h2>
            <Button to="/register">
              Create your account <FiArrowUpRight />
            </Button>
            <p>One secure vault can take you further.</p>
          </section>
        </main>
        <footer className={s.footer}>
          <div>
            <Brand />
            <span>A clearer perspective. A world of possibilities.</span>
            <a href="#faq">
              Questions? Start here <FiArrowRight />
            </a>
            <Link to="/terms">
              Terms &amp; investment policy <FiArrowRight />
            </Link>
          </div>
          <p>
            Investing involves risk. Asset values can rise or fall, and you may
            lose your capital. Market quotes may be delayed and are not
            investment advice.
          </p>
          <div className={s.copyright}>
            <span>
              © {new Date().getFullYear()} CMC TradeVault. All rights
              reserved.
            </span>
            <span>
              Built for your next chapter. <FiArrowUpRight />
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
