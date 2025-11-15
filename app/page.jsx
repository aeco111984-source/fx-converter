// app/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { currencyList, defaultBase, defaultQuote } from "./currencies";
import { getRateWithHistory } from "./rates";

function findCurrency(code) {
  return currencyList.find((c) => c.code === code) || currencyList[0];
}

function formatAmount(value) {
  if (Number.isNaN(value)) return "";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function formatRate(value) {
  if (Number.isNaN(value)) return "";
  return value.toFixed(6);
}

function formatAsOf(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPct(x) {
  if (x == null || Number.isNaN(x)) return "–";
  const sign = x >= 0 ? "+" : "";
  return `${sign}${x.toFixed(2)}%`;
}

function Sparkline({ history }) {
  if (!history || history.length < 2) return null;

  const rates = history.map((p) => p.rate).filter((n) => typeof n === "number");
  if (rates.length < 2) return null;

  const max = Math.max(...rates);
  const min = Math.min(...rates);

  const points = rates.map((rate, idx) => {
    const x =
      rates.length === 1 ? 0 : (idx / (rates.length - 1)) * 100; // 0–100%
    let y;
    if (max === min) {
      y = 50;
    } else {
      const t = (rate - min) / (max - min); // 0–1
      y = 90 - t * 70; // 20–90 range
    }
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-10 w-24 text-sky-400/70"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkline" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(56,189,248)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="rgb(56,189,248)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#sparkline)"
        strokeWidth="3"
        strokeLinecap="round"
        points={points.join(" ")}
      />
    </svg>
  );
}

// Quick-select pairs (you can extend this list anytime)
const GLOBAL_MAJORS = [
  ["USD", "EUR"],
  ["USD", "JPY"],
  ["EUR", "GBP"],
  ["GBP", "USD"],
  ["EUR", "CHF"],
  ["AUD", "USD"],
  ["USD", "CAD"],
  ["NZD", "USD"],
];

export default function Page() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState(defaultBase);
  const [to, setTo] = useState(defaultQuote);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState(null);

  const fromCurrency = useMemo(() => findCurrency(from), [from]);
  const toCurrency = useMemo(() => findCurrency(to), [to]);

  async function runConversion(opts = {}) {
    const useAmount = opts.amount ?? amount;
    const useFrom = opts.from ?? from;
    const useTo = opts.to ?? to;

    if (!useFrom || !useTo) return;

    setError("");
    setLoading(true);

    try {
      const data = await getRateWithHistory(useFrom, useTo);
      const converted = useAmount * data.rate;

      setQuote({
        from: useFrom,
        to: useTo,
        amount: useAmount,
        converted,
        rate: data.rate,
        asOf: data.asOf,
        source: data.source,
        history: data.history,
        changes: data.changes,
      });

      setFrom(useFrom);
      setTo(useTo);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Could not load FX rates.");
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }

  // Initial quote on mount
  useEffect(() => {
    runConversion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSwap() {
    const newFrom = to;
    const newTo = from;
    setFrom(newFrom);
    setTo(newTo);
    runConversion({ from: newFrom, to: newTo });
  }

  function handleQuickPair(a, b) {
    setFrom(a);
    setTo(b);
    runConversion({ from: a, to: b });
  }

  async function handleCopy() {
    if (!quote) return;
    const text = `${formatAmount(quote.amount)} ${quote.from} = ${formatAmount(
      quote.converted
    )} ${quote.to} @ ${formatRate(quote.rate)} (${quote.source})`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Result copied to clipboard");
    } catch {
      alert("Could not copy – your browser blocked clipboard access.");
    }
  }

  async function handleShare() {
    if (!quote) return;
    const text = `${formatAmount(quote.amount)} ${quote.from} = ${formatAmount(
      quote.converted
    )} ${quote.to} (FX converter)`;
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({ title: "FX converter", text, url });
      } catch {
        // user cancelled – ignore
      }
    } else {
      handleCopy();
    }
  }

  const change = quote?.changes || {};
  const trendClass = (v) =>
    v == null
      ? "text-slate-400"
      : v >= 0
      ? "text-emerald-400"
      : "text-rose-400";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4 py-10">
      <div className="relative max-w-3xl w-full">
        {/* Soft spotlight background */}
        <div className="pointer-events-none absolute -inset-x-10 -inset-y-16 bg-gradient-to-br from-sky-500/20 via-cyan-400/10 to-transparent blur-3xl" />

        {/* Card with gentle slant (~3deg) */}
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute inset-0 rounded-3xl bg-sky-500/30 rotate-3 blur-sm" />
          <div className="relative rounded-3xl bg-slate-950/95 border border-slate-800/80 shadow-2xl px-6 py-7 sm:px-10 sm:py-9 backdrop-blur-xl">
            {/* Heading / SEO block */}
            <header className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                FX Rates in Real Time
              </h1>
              <p className="mt-1 text-sm sm:text-base text-slate-300">
                <span className="font-medium">
                  Exchange Rate &middot; Currency Converter
                </span>
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
                Live FX rates and currency exchange conversion. Optimised for
                forex rates, FX exchange and converted rate totals – retail and
                bureau rates may differ.
              </p>
            </header>

            {/* Form */}
            <section className="space-y-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-xs font-medium text-slate-300 uppercase tracking-[0.18em]"
                >
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  className="mt-2 w-full rounded-2xl bg-slate-900/80 border border-slate-700 px-4 py-3 text-base sm:text-lg font-medium text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-400 transition"
                  value={amount}
                  onChange={(e) =>
                    setAmount(Number(e.target.value || "0") || 0)
                  }
                />
              </div>

              {/* From / To selectors */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-[0.18em] mb-1.5">
                    From
                  </label>
                  <CurrencySelect
                    value={from}
                    onChange={(code) => setFrom(code)}
                  />
                </div>

                <div className="flex justify-center sm:justify-center mt-2 sm:mt-0">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="inline-flex items-center gap-1 rounded-full bg-sky-600/80 hover:bg-sky-500 px-4 py-2 text-xs font-medium shadow-lg shadow-sky-900/60 border border-sky-300/40 transition"
                  >
                    <span className="text-base leading-none">↕</span>
                    <span>Swap</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-[0.18em] mb-1.5">
                    To
                  </label>
                  <CurrencySelect value={to} onChange={(code) => setTo(code)} />
                </div>
              </div>

              {/* Convert button */}
              <button
                type="button"
                onClick={() => runConversion()}
                className="mt-3 w-full rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-slate-950 font-semibold text-base sm:text-lg py-3.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sky-900/60 transition hover:brightness-110"
                disabled={loading}
              >
                {loading ? "Converting…" : "Convert"}
              </button>
            </section>

            {/* Result card */}
            <section className="mt-6 sm:mt-7">
              {error && (
                <p className="text-sm text-rose-400 font-medium">
                  {error || "Could not load FX rates."}
                </p>
              )}

              {quote && !error && (
                <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 sm:px-5 sm:py-5">
                  <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-[0.18em]">
                    Result — Currency Conversion
                  </h2>

                  <p className="mt-2 text-lg sm:text-xl font-semibold">
                    {formatAmount(quote.amount)}{" "}
                    <span className="text-slate-200">{quote.from}</span>{" "}
                    <span className="text-slate-400">=</span>{" "}
                    <span className="text-sky-400">
                      {formatAmount(quote.converted)} {quote.to}
                    </span>
                  </p>

                  <p className="mt-1 text-xs sm:text-sm text-slate-400">
                    Your exchange conversion uses a mid-market FX rate. Converted
                    rate:{" "}
                    <span className="font-medium">
                      1 {quote.from} = {formatRate(quote.rate)} {quote.to}
                    </span>
                    .
                  </p>

                  {/* Trend + sparkline */}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Sparkline history={quote.history} />

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] sm:text-xs">
                      <span className={trendClass(change.d1)}>
                        1D {formatPct(change.d1)}
                      </span>
                      <span className={trendClass(change.d7)}>
                        7D {formatPct(change.d7)}
                      </span>
                      <span className={trendClass(change.d30)}>
                        30D {formatPct(change.d30)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] sm:text-xs text-slate-500">
                    Rate as of{" "}
                    <span className="font-medium">
                      {formatAsOf(quote.asOf)}
                    </span>{" "}
                    · Source: {quote.source}. Retail and bureau FX rates may
                    vary.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] sm:text-xs">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-sky-400 hover:text-sky-300 transition"
                    >
                      Copy result
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-sky-400 hover:text-sky-300 transition"
                    >
                      Share
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Popular pairs */}
            <section className="mt-6 sm:mt-7">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-[0.18em] mb-2">
                Popular FX pairs
              </p>
              <div className="flex flex-wrap gap-2">
                {GLOBAL_MAJORS.map(([a, b]) => (
                  <button
                    key={`${a}-${b}`}
                    type="button"
                    onClick={() => handleQuickPair(a, b)}
                    className="rounded-full border border-slate-700/80 bg-slate-950/60 px-3.5 py-1.5 text-xs text-slate-200 hover:border-sky-400 hover:text-sky-200 transition"
                  >
                    {a} → {b}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

// Simple native <select> with all currencies
function CurrencySelect({ value, onChange }) {
  return (
    <select
      className="w-full rounded-2xl bg-slate-900/80 border border-slate-700 px-3 py-2.5 text-sm sm:text-base text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-400 transition"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {currencyList.map((c) => (
        <option key={c.code} value={c.code}>
          {c.flag ? `${c.flag} ` : ""}{c.label}
        </option>
      ))}
    </select>
  );
}
