"use client";

import { useState } from "react";

// Currency List (160 currencies supported)
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

      if (!res.ok) throw new Error("Failed fetching");

      const data = await res.json();
      const r = data.rates?.[quote] ?? null;

      if (!r) throw new Error("No rate");

      const converted = (parseFloat(amount) * r).toFixed(6);
      const nowUTC = new Date().toISOString().replace("T", " ").slice(0, 19);

      setRate(r.toFixed(6));
      setResult(converted);
      setTimestamp(nowUTC);
    } catch (e) {
      setResult(null);
      setRate(null);
      setTimestamp("");
      alert("Could not load FX rates.");
    }
  }

  function swap() {
    const b = base;
    setBase(quote);
    setQuote(b);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "#020617",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* TITLE AREA */}
      <header style={{ textAlign: "center", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
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

      {/* MAIN CARD */}
      <div
        style={{
          transform: "rotate(-3deg)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "20px",
          borderRadius: "22px",
          maxWidth: "450px",
          margin: "0 auto",
        }}
      >
        {/* AMOUNT */}
        <label style={{ fontSize: "14px", opacity: 0.85 }}>Amount</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "6px",
            marginBottom: "16px",
            borderRadius: "10px",
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
            marginTop: "6px",
            marginBottom: "16px",
            borderRadius: "10px",
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

        {/* SWAP BUTTON */}
        <div style={{ textAlign: "center", margin: "12px 0" }}>
          <button
            onClick={swap}
            style={{
              padding: "10px 24px",
              borderRadius: "50px",
              background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
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
            marginTop: "6px",
            marginBottom: "16px",
            borderRadius: "10px",
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

        {/* CONVERT BUTTON */}
        <button
          onClick={convert}
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "10px",
            border: "none",
            borderRadius: "18px",
            background: "linear-gradient(90deg, #0ea5e9, #3b82f6)",
            fontSize: "20px",
            color: "white",
            fontWeight: 600,
          }}
        >
          Convert
        </button>

        {/* RESULT */}
        {result && (
          <div
            style={{
              marginTop: "24px",
              padding: "18px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
              Result – Currency Conversion
            </h2>

            <p style={{ opacity: 0.85, marginBottom: "8px" }}>
              Currency Conversion
            </p>

            <p style={{ fontSize: "22px", fontWeight: 600 }}>
              {amount} {base} ={" "}
              <span style={{ color: "#22c55e" }}>{result}</span> {quote}
            </p>

            <p style={{ marginTop: "10px", opacity: 0.85 }}>
              Currency Exchange Conversion – FX rate {rate} ({base}/{quote})
            </p>

            <p style={{ marginTop: "6px", opacity: 0.6, fontSize: "12px" }}>
              Updated: {timestamp} (UTC)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
