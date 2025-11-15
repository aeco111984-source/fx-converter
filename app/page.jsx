"use client";

import { useState } from "react";
import currencies from "./currencies";

export default function Page() {
  const [amount, setAmount] = useState("100");
  const [base, setBase] = useState("USD");
  const [quote, setQuote] = useState("EUR");
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [timestamp, setTimestamp] = useState("");

  async function convert() {
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?from=${base}&to=${quote}`
      );
      if (!res.ok) throw new Error("FX fetch failed");

      const data = await res.json();
      const r = data.rates?.[quote];

      if (!r) throw new Error("Missing rate");

      const nowUTC = new Date().toISOString().replace("T", " ").slice(0, 19);
      const converted = (parseFloat(amount) * r).toFixed(6);

      setRate(r.toFixed(6));
      setResult(converted);
      setTimestamp(nowUTC);
    } catch {
      alert("Could not load FX rates.");
      setResult(null);
      setRate(null);
      setTimestamp("");
    }
  }

  function swap() {
    const temp = base;
    setBase(quote);
    setQuote(temp);
  }

  return (
    <div style={{ color: "white" }}>
      {/* HERO */}
      <header style={{ textAlign: "center", marginBottom: "26px" }}>
        <h1 style={{ fontSize: "34px", fontWeight: 700 }}>
          FX Rates Real Time
        </h1>

        <p style={{ marginTop: "8px", fontSize: "16px", opacity: 0.85 }}>
          Exchange Rate & Currency Converter – live foreign currency rates in
          real time.
        </p>

        <p style={{ marginTop: "4px", fontSize: "13px", opacity: 0.65 }}>
          Live mid-market forex rates from ECB / Frankfurter. Indicative rates –
          bureau and retail rates may vary.
        </p>
      </header>

      {/* CARD */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "22px",
          transform: "skewX(-3deg)",
        }}
      >
        <div style={{ transform: "skewX(3deg)" }}>
          {/* AMOUNT */}
          <label style={{ fontSize: "14px", opacity: 0.85 }}>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              margin: "6px 0 18px",
              background: "#0f172a",
              border: "1px solid #1e293b",
              color: "white",
              fontSize: "18px",
            }}
          />

          {/* FROM */}
          <label style={{ fontSize: "14px", opacity: 0.85 }}>From</label>
          <select
            value={base}
            onChange={(e) => setBase(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              margin: "6px 0 18px",
              background: "#0f172a",
              border: "1px solid #1e293b",
              color: "white",
              fontSize: "16px",
            }}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>

          {/* SWAP */}
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <button
              onClick={swap}
              style={{
                padding: "10px 26px",
                borderRadius: "50px",
                background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
                border: "none",
                color: "white",
                fontSize: "16px",
              }}
            >
              ↕ Swap
            </button>
          </div>

          {/* TO */}
          <label style={{ fontSize: "14px", opacity: 0.85 }}>To</label>
          <select
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              margin: "6px 0 20px",
              background: "#0f172a",
              border: "1px solid #1e293b",
              color: "white",
              fontSize: "16px",
            }}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>

          {/* BUTTON */}
          <button
            onClick={convert}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "16px",
              background: "linear-gradient(90deg,#0ea5e9,#3b82f6)",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: "20px",
            }}
          >
            Convert
          </button>

          {/* RESULT */}
          {result && (
            <div
              style={{
                marginTop: "28px",
                padding: "20px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px",
              }}
            >
              <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                Currency Conversion Result / Amount
              </h2>

              <p style={{ opacity: 0.85, marginBottom: "8px" }}>
                Currency Exchange Total
              </p>

              <p style={{ fontSize: "24px", fontWeight: 700 }}>
                {amount} {base} ={" "}
                <span style={{ color: "#22c55e" }}>{result}</span> {quote}
              </p>

              <p style={{ marginTop: "10px", opacity: 0.85, fontSize: "14px" }}>
                Currency Exchange Conversion – FX rate {rate} ({base}/{quote})
              </p>

              <p style={{ marginTop: "6px", opacity: 0.6, fontSize: "12px" }}>
                Updated: {timestamp} (UTC)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
