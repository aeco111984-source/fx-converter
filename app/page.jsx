"use client";
import { useState, useEffect } from "react";
import currencies from "./currencies";

export default function Page() {
  const [amount, setAmount] = useState("1");
  const [base, setBase] = useState("USD");
  const [quote, setQuote] = useState("EUR");
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [timestamp, setTimestamp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    setLoading(true);
    setError("");
    try {
      const url = `https://api.frankfurter.app/latest?from=${base}&to=${quote}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load FX rates");

      const data = await res.json();
      const r = data.rates[quote];
      setRate(r);
      setResult((Number(amount) * r).toFixed(6));
      setTimestamp(new Date().toISOString());
    } catch (err) {
      setError("Could not load FX rates.");
    }
    setLoading(false);
  }

  function swap() {
    const a = base;
    setBase(quote);
    setQuote(a);
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "20px",
        background: "#0f172a",
        borderRadius: "28px",
        marginTop: "24px",
        boxShadow: "0px 0px 40px rgba(0,0,0,0.55)",
      }}
    >
      {/* NEW TITLE BLOCK */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          marginBottom: "6px",
          color: "#fff",
        }}
      >
        FX Rates Real Time
      </h1>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "22px",
          opacity: 0.85,
          marginBottom: "10px",
        }}
      >
        Exchange Rate & Currency Converter – live foreign currency rates in
        real time.
      </p>

      {/* INPUTS */}
      <label>Amount</label>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          marginBottom: "18px",
          borderRadius: "12px",
          border: "1px solid #1e293b",
          background: "#020817",
          color: "#fff",
        }}
      />

      <label>From</label>
      <select
        value={base}
        onChange={(e) => setBase(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          marginBottom: "12px",
          borderRadius: "12px",
          background: "#020817",
          border: "1px solid #1e293b",
          color: "#fff",
        }}
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} — {c.name}
          </option>
        ))}
      </select>

      {/* SWAP */}
      <button
        onClick={swap}
        style={{
          width: "100%",
          padding: "14px",
          background: "#1e40af",
          color: "#fff",
          borderRadius: "12px",
          marginBottom: "12px",
          fontWeight: 600,
        }}
      >
        ↕ Swap
      </button>

      <label>To</label>
      <select
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          marginBottom: "16px",
          borderRadius: "12px",
          background: "#020817",
          border: "1px solid #1e293b",
          color: "#fff",
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
        disabled={loading}
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "16px",
          background:
            "linear-gradient(90deg, #0284c7 0%, #3b82f6 50%, #0284c7 100%)",
          color: "#fff",
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "22px",
        }}
      >
        {loading ? "Loading..." : "Convert"}
      </button>

      {/* OUTPUT BLOCK */}
      {result && (
        <div
          style={{
            background: "#0a1120",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "18px",
            border: "1px solid #1e293b",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              marginBottom: "10px",
            }}
          >
            Currency Conversion Result / Amount
          </h2>

          <p
            style={{
              marginBottom: "6px",
              fontSize: "16px",
              opacity: 0.8,
            }}
          >
            Currency Exchange Total
          </p>

          <p
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#10b981",
            }}
          >
            {amount} {base} = {result} {quote}
          </p>

          <p style={{ marginTop: "12px", opacity: 0.7 }}>
            Currency Exchange Conversion – FX rate {rate} ({base}/{quote})
          </p>

          <p style={{ marginTop: "10px", opacity: 0.6, fontSize: "12px" }}>
            Updated: {timestamp.replace("T", " ").slice(0, 19)} (UTC)
          </p>
        </div>
      )}

      {/* FOOTER (MOVED TO BOTTOM AS REQUESTED) */}
      <p
        style={{
          opacity: 0.45,
          fontSize: "12px",
          marginTop: "10px",
          textAlign: "center",
          lineHeight: "16px",
        }}
      >
        Live mid-market forex rates from ECB / Frankfurter.<br />
        Indicative rates – bureau and retail rates may vary.
      </p>
    </div>
  );
}
