"use client";

import { useState } from "react";
import CURRENCIES from "./currencies";
import { getRateWithFallback } from "./rates";

const cardOuterStyle = {
  maxWidth: 420,
  width: "100%",
  transform: "skewX(-7deg)",
  background:
    "radial-gradient(circle at top left,#020617 0,#020617 45%,#020617 100%)",
  borderRadius: 26,
  boxShadow:
    "0 20px 55px rgba(0,0,0,0.85), 0 0 0 1px rgba(56,189,248,0.2)",
  padding: 22,
  boxSizing: "border-box",
};

const cardInnerStyle = {
  transform: "skewX(7deg)",
};

const labelStyle = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.08,
  color: "#9CA3AF",
  marginBottom: 4,
};

const inputBase = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: 14,
  fontSize: 15,
  border: "1px solid #1F2937",
  background: "#020617",
  color: "#E5E7EB",
  boxSizing: "border-box",
};

const selectBase = {
  ...inputBase,
  fontSize: 14,
};

export default function Page() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function formatNumber(n, min = 2, max = 6) {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  }

  async function handleConvert() {
    setError("");
    setResult(null);

    const amt = Number(amount);
    if (!amt || Number.isNaN(amt)) {
      setError("Enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const { rate, asOf, source } = await getRateWithFallback(from, to);
      const value = amt * rate;

      setResult({
        amount: amt,
        from,
        to,
        rate,
        value,
        asOf,
        source,
      });
    } catch (e) {
      console.error(e);
      setError("Could not load FX rates.");
    } finally {
      setLoading(false);
    }
  }

  function handleSwap() {
    const prevFrom = from;
    setFrom(to);
    setTo(prevFrom);
    // Optional: auto-reconvert if we already had a result
    if (result) {
      handleConvert();
    }
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top,#020617 0,#020617 52%,#020617 100%)",
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      <div style={cardOuterStyle}>
        <div style={cardInnerStyle}>
          {/* HEADER */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
                color: "#F9FAFB",
                marginBottom: 3,
              }}
            >
              FX Rates in Real Time
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>
              Live mid-market conversions. Dark fintech layout.
            </div>
          </div>

          {/* AMOUNT */}
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>Amount</div>
            <input
              type="number"
              style={inputBase}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* FROM */}
          <div style={{ marginBottom: 10 }}>
            <div style={labelStyle}>From</div>
            <select
              style={selectBase}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* SWAP BUTTON */}
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <button
              onClick={handleSwap}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "9px 16px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.6)",
                background:
                  "radial-gradient(circle at top,#1D4ED8 0,#1E293B 65%)",
                color: "#E5E7EB",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 17 }}>⇅</span>
              <span>Swap</span>
            </button>
          </div>

          {/* TO */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>To</div>
            <select
              style={selectBase}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* CONVERT BUTTON */}
          <button
            onClick={handleConvert}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(90deg,#22C1C3 0%,#0EA5E9 48%,#22C1C3 100%)",
              color: "#020617",
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginBottom: 10,
            }}
          >
            {loading ? "Converting…" : "Convert"}
          </button>

          {/* ERROR */}
          {error && (
            <div
              style={{
                fontSize: 11,
                color: "#FCA5A5",
                marginBottom: 8,
              }}
            >
              {error}
            </div>
          )}

          {/* RESULT */}
          {result && (
            <div
              style={{
                marginTop: 6,
                padding: 12,
                borderRadius: 16,
                background:
                  "linear-gradient(135deg,rgba(15,23,42,0.95),rgba(15,23,42,0.98))",
                border: "1px solid rgba(148,163,184,0.4)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#9CA3AF",
                  marginBottom: 4,
                }}
              >
                Result
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#F9FAFB",
                  marginBottom: 2,
                }}
              >
                {formatNumber(result.amount, 2, 2)} {result.from} ={" "}
                <span style={{ color: "#22D3EE" }}>
                  {formatNumber(result.value, 2, 6)}
                </span>{" "}
                {result.to}
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                Rate: {formatNumber(result.rate, 6, 6)}{" "}
                {result.asOf && <>• Updated {result.asOf}</>} • Source:{" "}
                {result.source}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#6B7280",
                  marginTop: 3,
                }}
              >
                * Indicative mid-market levels. Retail & bureau rates may vary.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
