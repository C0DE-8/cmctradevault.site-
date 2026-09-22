// The established TradingView iframe embed avoids ES-module registration failures.
export function mountTradingView(
  container,
  symbol,
  onReady,
  onError,
  advanced = false,
) {
  const wrapper = document.createElement("div");
  wrapper.className = "tradingview-widget-container";
  wrapper.style.height = "100%";
  const target = document.createElement("div");
  target.className = "tradingview-widget-container__widget";
  wrapper.appendChild(target);
  container.appendChild(wrapper);
  let active = true;
  const observer = new MutationObserver(() => {
    const frame = wrapper.querySelector("iframe");
    if (!frame) return;
    observer.disconnect();
    frame.title = `${symbol} TradingView price chart`;
    frame.addEventListener(
      "load",
      () => {
        if (active) {
          clearTimeout(timeout);
          onReady();
        }
      },
      { once: true },
    );
  });
  observer.observe(wrapper, { childList: true, subtree: true });
  const timeout = setTimeout(() => {
    if (active) onError();
  }, 20000);
  const script = document.createElement("script");
  script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${advanced ? "advanced-chart" : "mini-symbol-overview"}.js`;
  script.async = true;
  const miniConfig = {
    symbol,
    width: "100%",
    height: "100%",
    locale: "en",
    dateRange: "1D",
    colorTheme: "dark",
    trendLineColor: "#31e6ff",
    underLineColor: "rgba(179,246,170,0.18)",
    underLineBottomColor: "rgba(179,246,170,0)",
    isTransparent: false,
    autosize: true,
    largeChartUrl: "",
    chartOnly: false,
    noTimeScale: true,
  };
  script.textContent = JSON.stringify(
    advanced
      ? {
          autosize: true,
          symbol,
          interval: "1",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          allow_symbol_change: false,
          hide_side_toolbar: false,
          withdateranges: true,
          calendar: false,
          support_host: "https://www.tradingview.com",
        }
      : miniConfig,
  );
  script.onerror = () => {
    clearTimeout(timeout);
    if (active) onError();
  };
  wrapper.appendChild(script);
  return () => {
    active = false;
    clearTimeout(timeout);
    observer.disconnect();
    wrapper.remove();
  };
}
export async function getMarket(asset, signal) {
  const base = import.meta.env.VITE_MARKET_API_URL || "/api/markets";
  const response = await fetch(`${base}/${asset}`, { signal });
  if (!response.ok) throw new Error("Market data unavailable");
  return response.json();
}
