// app/rates.js

// Primary: Frankfurter (ECB), fallback: exchangerate.host
const FRANKFURTER = "https://api.frankfurter.app";
const EX_HOST = "https://api.exchangerate.host";

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

async function safeJson(url) {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// Latest from Frankfurter (ECB)
async function fetchFrankfurterLatest(from, to) {
  const url = `${FRANKFURTER}/latest?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;

  const data = await safeJson(url);
  const rate = data.rates?.[to];

  if (!rate) throw new Error("Frankfurter missing rate");

  return {
    rate,
    asOf: data.date || isoDate(new Date()),
    source: "Frankfurter (ECB)",
  };
}

// Latest from exchangerate.host
async function fetchHostLatest(from, to) {
  const url = `${EX_HOST}/latest?base=${encodeURIComponent(
    from
  )}&symbols=${encodeURIComponent(to)}`;

  const data = await safeJson(url);
  const rate = data.rates?.[to];

  if (!rate) throw new Error("exchangerate.host missing rate");

  return {
    rate,
    asOf: data.date || isoDate(new Date()),
    source: "exchangerate.host",
  };
}

// Daily history from exchangerate.host for last N days
async function fetchHostHistory(from, to, days) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - days);

  const url = `${EX_HOST}/timeseries?base=${encodeURIComponent(
    from
  )}&symbols=${encodeURIComponent(
    to
  )}&start_date=${isoDate(start)}&end_date=${isoDate(end)}`;

  const data = await safeJson(url);
  const ratesObj = data.rates || {};

  const dates = Object.keys(ratesObj).sort();
  if (dates.length < 2) throw new Error("Not enough history");

  const history = dates.map((d) => ({
    date: d,
    rate: ratesObj[d]?.[to],
  })).filter((p) => typeof p.rate === "number");

  if (history.length < 2) throw new Error("Not enough numeric points");

  const first = history[0].rate;
  const last = history[history.length - 1].rate;

  function changeOver(windowDays) {
    if (history.length < 2) return null;
    const stepStartIndex = Math.max(history.length - 1 - windowDays, 0);
    const startRate = history[stepStartIndex].rate;
    if (!startRate) return null;
    return ((last - startRate) / startRate) * 100;
  }

  return {
    history,
    change1d: changeOver(1),
    change7d: changeOver(7),
    change30d: changeOver(30),
  };
}

/**
 * Main helper: get latest FX rate plus small history window.
 * - Tries Frankfurter first (ECB), then exchangerate.host.
 * - History (for trend) is always pulled from exchangerate.host when possible.
 */
export async function getRateWithHistory(from, to) {
  let latest;
  let primaryError;

  try {
    latest = await fetchFrankfurterLatest(from, to);
  } catch (err) {
    primaryError = err;
    try {
      latest = await fetchHostLatest(from, to);
    } catch (err2) {
      console.error("All providers failed", primaryError, err2);
      throw new Error("Could not load FX rates from any provider.");
    }
  }

  // Always stamp with "now" so we never show a future date
  const now = new Date();
  const asOf = now.toISOString();

  let history = [];
  let changes = { d1: null, d7: null, d30: null };

  try {
    const hist = await fetchHostHistory(from, to, 30);
    history = hist.history;
    changes = {
      d1: hist.change1d,
      d7: hist.change7d,
      d30: hist.change30d,
    };
  } catch (err) {
    // History is a bonus; log but don't break the main quote
    console.warn("History fetch failed:", err?.message || err);
  }

  return {
    rate: latest.rate,
    asOf,
    source: latest.source,
    history,
    changes,
  };
}
