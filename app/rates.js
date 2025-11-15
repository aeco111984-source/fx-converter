const TEN_MIN = 10 * 60 * 1000;

let cache = {
  timestamp: 0,
  base: "EUR",
  rates: null,
};

export async function getRates() {
  const now = Date.now();

  // Use cache if fresh
  if (cache.rates && now - cache.timestamp < TEN_MIN) {
    return cache;
  }

  try {
    const res = await fetch(
      "https://api.exchangerate.host/latest?base=EUR"
    );
    const data = await res.json();

    cache = {
      timestamp: now,
      base: data.base,
      rates: data.rates,
    };

    return cache;
  } catch (e) {
    console.error("Rate fetch failed", e);
    // Fallback: return last known cache if exists
    return cache;
  }
}
