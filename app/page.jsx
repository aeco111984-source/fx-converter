"use client";

import { useState, useEffect } from "react";
import { getRates } from "./rates";

export default function Home() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [rate, setRate] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getRates();
      setCurrencies(Object.keys(data.rates));
      setRate(data.rates[to] / data.rates[from]);
      setTimestamp(data.timestamp);
    }
    load();
  }, [from, to]);

  const convert = () => {
    if (!rate) return 0;
    return (amount * rate).toFixed(4);
  };

  const swap = () => {
    const f = from;
    setFrom(to);
    setTo(f);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>FX Rates in Real Time</h1>

      <div style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        maxWidth: 420,
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>

        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 6,
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{ flex: 1, padding: 10, borderRadius: 8 }}
          >
            {currencies.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button onClick={swap} style={{
            padding: "10px 12px",
            borderRadius: 8,
            background: "#ff9800",
            color: "white",
            border: "none"
          }}>
            ⇄
          </button>

          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ flex: 1, padding: 10, borderRadius: 8 }}
          >
            {currencies.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {}}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 14,
            background: "#ff9800",
            color: "white",
            borderRadius: 8,
            border: "none",
            fontWeight: "bold"
          }}
        >
          Convert
        </button>

        {rate && (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <h2>{amount} {from} = {convert()} {to}</h2>
            <p style={{ color: "#777" }}>
              Rate: {rate.toFixed(6)} — Updated {timestamp}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
