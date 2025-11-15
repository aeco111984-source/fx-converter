"use client";
import { useEffect, useState } from "react";
import currencies from "./currencies";

export default function Home() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rate, setRate] = useState(null);
  const [result, setResult] = useState(null);

  const fetchRate = async () => {
    try {
      const res = await fetch(`/rates?base=${from}`);
      const data = await res.json();

      if (data && data.rates && data.rates[to]) {
        setRate(data.rates[to]);
        setResult((amount * data.rates[to]).toFixed(4));
      }
    } catch (err) {
      console.error("Rate fetch failed", err);
    }
  };

  const swap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, textAlign: "center" }}>
        FX Rates in Real Time
      </h1>

      <div
        style={{
          marginTop: 20,
          padding: 20,
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* AMOUNT INPUT */}
        <label>Amount</label>
        <input
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            fontSize: 18,
            marginTop: 8,
            border: "1px solid #ccc",
          }}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* DROPDOWNS */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            alignItems: "center",
          }}
        >
          {/* FROM */}
          <select
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              fontSize: 18,
            }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
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
              width: 48,
              height: 48,
              background: "orange",
              borderRadius: 10,
              border: "none",
              fontSize: 22,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            ⇄
          </button>

          {/* TO */}
          <select
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              fontSize: 18,
            }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <button
          onClick={fetchRate}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 16,
            background: "orange",
            border: "none",
            borderRadius: 14,
            fontSize: 20,
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Convert
        </button>

        {/* RESULT */}
        {result && (
          <div style={{ marginTop: 20, fontSize: 22, fontWeight: 600 }}>
            {amount} {from} ={" "}
            <span style={{ color: "orange" }}>{result}</span> {to}
            <div style={{ fontSize: 14, marginTop: 6, opacity: 0.7 }}>
              Rate used: {rate}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
