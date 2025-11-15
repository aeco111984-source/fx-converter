// app/rates.js
// Multi-source FX engine with fallback.
// 1) exchangerate.host
// 2) Frankfurter (ECB)
// 3) OpenExchangeRates (if NEXT_PUBLIC_OXR_KEY is set)

const EX_HOST_BASE = "https://api.exchangerate.host";
const FRANKFURTER_BASE = "https://api.frankfurter.app";
const OXR_KEY = process.env.NEXT_PUBLIC_OXR_KEY || "";

/**
 * Fetch rates for a given base currency with fallback across providers.
 * Returns { base, rates, asOf, source }
 */
export async function fetchRatesWithFallback(base) {
  // --- 1) exchangerate.host ---
  try {
    const url = `${EX_HOST_BASE}/latest?base=${encodeURIComponent(base)}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data && data.rates) {
      return {
        base,
        rates: data.rates,
        asOf: data.date || new Date().toISOString().slice(0, 10),
        source: "exchangerate.host",
      };
    }
  } catch (e) {
    // silently fail and try next provider
    console.warn("exchangerate.host failed", e);
  }

  // --- 2) Frankfurter (ECB) ---
  try {
    const url = `${FRANKFURTER_BASE}/latest?from=${encodeURIComponent(base)}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data && data.rates) {
      return {
        base,
        rates: data.rates,
        asOf: data.date || new Date().toISOString().slice(0, 10),
        source: "frankfurter (ECB)",
      };
    }
  } catch (e) {
    console.warn("Frankfurter (ECB) failed", e);
  }

  // --- 3) OpenExchangeRates (USD base) ---
  if (OXR_KEY) {
    try {
      const url = `https://openexchangerates.org/api/latest.json?app_id=${encodeURIComponent(
        OXR_KEY
      )}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      if (data && data.rates) {
        const usdRates = data.rates;
        // OpenExchangeRates is always USD base.
        if (!usdRates[base]) {
          throw new Error("Base not supported in OXR");
        }

        const usdToBase = 1 / usdRates[base];
        const converted = {};

        Object.keys(usdRates).forEach((code) => {
          if (code === base) return;
          converted[code] = usdRates[code] * usdToBase;
        });

        return {
          base,
          rates: converted,
          asOf: new Date(data.timestamp * 1000)
            .toISOString()
            .slice(0, 10),
          source: "openexchangerates",
        };
      }
    } catch (e) {
      console.warn("OpenExchangeRates failed", e);
    }
  }

  throw new Error("No FX providers available");
}

/**
 * Get a single cross rate with fallback.
 * from → to
 * Returns { rate, asOf, source }
 */
export async function getRateWithFallback(from, to) {
  if (from === to) {
    return {
      rate: 1,
      asOf: new Date().toISOString().slice(0, 10),
      source: "identity",
    };
  }

  const { base, rates, asOf, source } = await fetchRatesWithFallback(from);

  // base is "from" because we requested it as that.
  const rate = rates[to];
  if (!rate || typeof rate !== "number") {
    throw new Error(`Rate not found for ${from}->${to}`);
  }

  return { rate, asOf, source };
}
