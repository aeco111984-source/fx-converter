"use client";

import { useState } from "react";
import CURRENCIES from "./currencies";

export default function Converter() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchRate = async (base, target) => {
    try {
      // Frankfurter API (primary)
      const res1 = await fetch(
        `https://api.frankfurter.app/latest?from=${base}&to=${target}`
      );
      if (res1.ok) {
        const data = await res1.json();
        return data.rates[target];
      }
    } catch (e) {}

    try {
      // ECB fallback (European Central Bank)
      const res2 = await fetch(
        `https://api.exchangerate.host/latest?base=${base}&symbols=${target}`
      );
      if (res2.ok) {
        const data = await res2.json();
        return data.rates[target];
      }
    } catch (e) {}

    return null;
  };

  const convert = async () => {
    setError(null);
    setResult(null);

    const rate = await fetchRate(from, to);

    if (!rate) {
      setError("Could not load FX rates.");
      return;
    }

    const converted = (amount * rate).toFixed(6);
    setResult({
      base: from,
      target: to,
      rate,
      converted
    });
  };

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h1>FX Rates in Real Time</h1>
      <p>Live mid-market conversions. Dark fintech layout.</p>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 12, borderRadius: 8, marginTop: 10 }}
      />

      <select
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{ width: "100%", padding: 12, borderRadius: 8, marginTop: 10 }}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} — {c.name}
          </option>
        ))}
      </select>

      <select
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: "100%", padding: 12, borderRadius: 8, marginTop: 10 }}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} — {c.name}
          </option>
        ))}
      </select>

      <button
        onClick={convert}
        style={{
          marginTop: 20,
          padding: 14,
          width: "100%",
          borderRadius: 8,
          background: "#0af",
          fontSize: 18
        }}
      >
        Convert
      </button>

      {error && <p style={{ color: "red", marginTop: 20 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Result</h3>
          <p>
            {amount} {result.base} ={" "}
            <span style={{ fontWeight: "bold" }}>{result.converted}</span>{" "}
            {result.target}
          </p>
          <p>Rate: {result.rate}</p>
        </div>
      )}
    </div>
  );
}
