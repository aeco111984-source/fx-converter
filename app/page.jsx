"use client";

import { useState, useEffect } from "react";
import { currencies } from "./currencies";

export default function Page() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rate, setRate] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-detect local currency
  useEffect(() => {
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      const region = locale.split("-")[1];
      const found = currencies.find(c => c.flag && region && c.flag.includes(region));

      if (found) setFrom(found.code);
      else setFrom("EUR");
    } catch (e) {
      setFrom("EUR");
    }
  }, []);

  async function convert() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.exchangerate.host/latest?base=${from}&symbols=${to}`
      );
      const data = await res.json();
      const r = data.rates[to];
      setRate(r);
      setResult(amount * r);
    } catch (e) {
      alert("Rate unavailable.");
    }
    setLoading(false);
  }

  function swap() {
    const f = from;
    setFrom(to);
    setTo(f);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, textAlign: "center" }}>
        FX Rates in Real Time
      </h1>

      <div style={{ marginTop: 20, padding: 20, borderRadius: 20, background: "#fff" }}>
        <label>Amount</label>
        <input
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            marginTop: 10,
            border: "1px solid #ccc",
          }}
          type="number"
        />

        {/* Currency selectors */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          {/* FROM */}
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{ flex: 1, padding: 12, borderRadius: 8 }}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.name}
              </option>
            ))}
          </select>

          {/* SWAP */}
          <button
            onClick={swap}
            style={{
              padding: 12,
              borderRadius: 8,
              background: "orange",
              border: 0,
              fontWeight: 600,
            }}
          >
            ⇆
          </button>

          {/* TO */}
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ flex: 1, padding: 12, borderRadius: 8 }}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* CONVERT */}
        <button
          onClick={convert}
          disabled={loading}
          style={{
            marginTop: 25,
            width: "100%",
            padding: 15,
            borderRadius: 12,
            border: 0,
            background: "orange",
            fontSize: 18,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {loading ? "Loading..." : "Convert"}
        </button>

        {/* RESULT */}
        {result && (
          <div style={{ marginTop: 25, fontSize: 22, fontWeight: 700 }}>
            {amount} {from} = {result.toFixed(4)} {to}
            <br />
            <span style={{ fontSize: 14, color: "#555" }}>
              Rate: {rate} • Updated now
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
