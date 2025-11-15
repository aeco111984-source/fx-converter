// app/rates.js

// --- 1) Free ECB Feed ------------------------------------------------------
// ECB gives EUR → {all currencies}
// We fetch once per deploy (server cache)

export async function getRates() {
  const res = await fetch("https://api.exchangerate.host/latest?base=EUR");
  const data = await res.json();
  return data.rates;        // { USD: 1.086, GBP: 0.86, ... }
}

// --- 2) Convert ANY → ANY --------------------------------------------------
// If user asks: amount * FROM/TO
// Example: JPY → USD = (EUR→USD) / (EUR→JPY)

export function convert(amount, from, to, eurRates) {
  if (!eurRates[from] || !eurRates[to]) return null;

  // EUR → FROM
  const eurToFrom = eurRates[from];

  // EUR → TO
  const eurToTo = eurRates[to];

  // FROM → TO
  const rate = eurToTo / eurToFrom;

  return {
    rate,
    result: amount * rate,
  };
}
