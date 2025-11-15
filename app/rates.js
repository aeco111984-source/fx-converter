export async function getRates() {
  const res = await fetch("https://api.exchangerate.host/latest?base=EUR");
  const data = await res.json();

  return {
    base: data.base,
    rates: data.rates,
    timestamp: new Date(data.date).toLocaleString()
  };
}
