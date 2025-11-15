"use client";

import { useEffect, useState } from "react";
import currencies from "./currencies";
import { getRates } from "./rates";

export default function Page() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [rates, setRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load rates on mount
  useEffect(() => {
    (async () => {
      const data = await getRates();
      if (data && data.rates) {
        setRates(data.rates);
        setLastUpdated(new Date(data.timestamp || Date.now()).toLocaleString());
        // initial calc
        computeConversion(data.rates, amount, from, to);
      }
    })();
  }, []);

  function computeConversion(ratesMap, amt, fromCode, toCode) {
    if (!ratesMap) return;
    const rFrom = ratesMap[fromCode];
    const rTo = ratesMap[toCode];
    if (!rFrom || !rTo) return;
    const cross = rTo / rFrom;
    setRate(cross);
    setResult((amt * cross).toFixed(4));
  }

  function handleConvert() {
    if (!rates) return;
    setLoading(true);
    computeConversion(rates, amount, from, to);
    setTimeout(() => setLoading(false), 150); // tiny UX delay
  }

  function handleSwap() {
    const prevFrom = from;
    setFrom(to);
    setTo(prevFrom);
    if (rates) computeConversion(rates, amount, to, prevFrom);
  }

  const cardOuter = {
    maxWidth: 420,
    width: "100%",
    transform: "skewX(-7deg)",
    background: "#0F172A",
    borderRadius: 24,
    boxShadow: "0 18px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,211,238,0.18)",
    padding: 22,
    boxSizing: "border-box",
  };

  const cardInner = {
    transform: "skewX(7deg)",
  };

  const labelStyle = {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    fontSize: 16,
    border: "1px solid #1F2933",
    background: "#020617",
    color: "#E5E7EB",
    boxSizing: "border-box",
  };

  const selectStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    fontSize: 14,
    border: "1px solid #1F2933",
    background: "#020617",
    color: "#E5E7EB",
    boxSizing: "border-box",
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={cardOuter}>
        <div style={cardInner}>
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#E0F2FE",
                marginBottom: 2,
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
            <div style={labelStyle}>Amount</div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value || 0))}
              style={inputStyle}
            />
          </div>

          {/* From / To */}
          <div style={{ marginBottom: 8 }}>
            <div style={labelStyle}>From</div>
            <select
              style={selectStyle}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <button
              onClick={handleSwap}
              style={{
                width: 42,
                height: 42,
                borderRadius: "999px",
                border: "1px solid rgba(248,250,252,0.25)",
                background: "transparent",
                color: "#22D3EE",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ⇅
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>To</div>
            <select
              style={selectStyle}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Convert button */}
          <button
            onClick={handleConvert}
            disabled={!rates || loading}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(90deg, #22D3EE 0%, #38BDF8 50%, #22D3EE 100%)",
              color: "#020617",
              fontWeight: 700,
              fontSize: 16,
              cursor: rates ? "pointer" : "default",
              opacity: rates ? 1 : 0.6,
              marginBottom: 12,
            }}
          >
            {loading ? "Converting..." : "Convert"}
          </button>

          {/* Result */}
          {result && (
            <div style={{ marginTop: 4 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#E5E7EB",
                  marginBottom: 4,
                }}
              >
                {amount.toFixed(2)} {from} ={" "}
                <span style={{ color: "#22D3EE" }}>{result}</span> {to}
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                {rate && <>Rate: {rate.toFixed(6)} • </>}
                {lastUpdated && <>Updated {lastUpdated}</>}
                {" • Source: ECB (via exchangerate.host)"}
              </div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>
                * Mid-market levels. Bureau and dealer rates may differ.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
