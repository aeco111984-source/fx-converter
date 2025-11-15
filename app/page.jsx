"use client";

import { useEffect, useState } from "react";
import CURRENCIES from "./currencies";

const API_URL = "https://api.exchangerate.host/latest?base=EUR";

export default function Page() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [rates, setRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch EUR rates once when page loads
  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch(API_URL, { cache: "no-store" });
        const data = await res.json();
        if (data && data.rates) {
          setRates(data.rates);
          setLastUpdated(
            data.date
              ? new Date(data.date + "T12:00:00Z").toLocaleString()
              : new Date().toLocaleString()
          );
        } else {
          setError("Could not load FX rates.");
        }
      } catch (e) {
        console.error(e);
        setError("Could not load FX rates.");
      }
    }
    loadRates();
  }, []);

  function convert() {
    setError("");
    if (!rates) {
      setError("Rates not loaded yet.");
      return;
    }
    const amt = Number(amount);
    if (isNaN(amt) || !amt) {
      setError("Enter a valid amount.");
      return;
    }
    const rFrom = rates[from];
    const rTo = rates[to];
    if (!rFrom || !rTo) {
      setError("Selected pair not available.");
      return;
    }

    setLoading(true);
    const crossRate = rTo / rFrom;
    const value = amt * crossRate;

    setResult({
      from,
      to,
      amount: amt,
      rate: crossRate,
      value,
    });

    setTimeout(() => setLoading(false), 120);
  }

  function handleSwap() {
    const prevFrom = from;
    setFrom(to);
    setTo(prevFrom);
    // Re-run conversion if we already have a result
    if (rates && result) convert();
  }

  function formatNumber(n, min = 2, max = 6) {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  }

  // === Styles ===
  const outer = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  };

  const cardOuter = {
    maxWidth: 420,
    width: "100%",
    transform: "skewX(-7deg)",
    background: "radial-gradient(circle at top left,#020617 0,#020617 45%,#020617 100%)",
    borderRadius: 26,
    boxShadow:
      "0 20px 55px rgba(0,0,0,0.85), 0 0 0 1px rgba(56,189,248,0.2)",
    padding: 22,
    boxSizing: "border-box",
  };

  const cardInner = {
    transform: "skewX(7deg)",
  };

  const label = {
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

  return (
    <div style={outer}>
      <div style={cardOuter}>
        <div style={cardInner}>
          {/* Header */}
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

          {/* Amount */}
          <div style={{ marginBottom: 14 }}>
            <div style={label}>Amount</div>
            <input
              type="number"
              style={inputBase}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* From */}
          <div style={{ marginBottom: 10 }}>
            <div style={label}>From</div>
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

          {/* Swap button */}
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

          {/* To */}
          <div style={{ marginBottom: 16 }}>
            <div style={label}>To</div>
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

          {/* Convert button */}
          <button
            onClick={convert}
            disabled={!rates || loading}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(90deg,#22C1C3 0%,#0EA5E9 45%,#22C1C3 100%)",
              color: "#020617",
              fontWeight: 700,
              fontSize: 16,
              cursor: !rates ? "default" : "pointer",
              opacity: rates ? 1 : 0.5,
              marginBottom: 10,
            }}
          >
            {loading ? "Converting…" : "Convert"}
          </button>

          {/* Error */}
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

          {/* Result */}
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
                Rate: {formatNumber(result.rate, 6, 6)}
                {lastUpdated && <> • Updated {lastUpdated}</>}
                {" • Source: ECB (exchangerate.host)"}
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
