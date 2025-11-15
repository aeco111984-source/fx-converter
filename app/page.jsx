"use client";

import { useEffect, useState } from "react";
import { getRates, convert } from "./rates";
import CURRENCIES from "./currencies";

export default function Page() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [rates, setRates] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getRates();
      setRates(data);
    }
    load();
  }, []);

  function doConvert() {
    if (!rates) return;

    const out = convert(Number(amount), from, to, rates);
    setResult(out);
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>FX Rates in Real Time</h1>

      {/* AMOUNT */}
      <input
        style={{
          width: "100%",
          padding: "15px",
          marginTop: "10px",
          borderRadius: "10px",
          background: "#0d1116",
          color: "white",
          border: "1px solid #333",
        }}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
      />

      {/* FROM */}
      <select
        style={{
          width: "100%",
          padding: "15px",
          marginTop: "15px",
          borderRadius: "10px",
          background: "#0d1116",
          color: "white",
          border: "1px solid #333",
        }}
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} — {c.name}
          </option>
        ))}
      </select>

      {/* SWAP BUTTON */}
      <button
        onClick={() => {
          const f = from;
          setFrom(to);
          setTo(f);
        }}
        style={{
          margin: "15px auto",
          display: "block",
          background: "#1f80e0",
          borderRadius: "50%",
          padding: "10px 20px",
          fontSize: "20px",
          border: "none",
          color: "white",
        }}
      >
        ⇅
      </button>

      {/* TO */}
      <select
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "10px",
          background: "#0d1116",
          color: "white",
          border: "1px solid #333",
        }}
        value={to}
        onChange={(e) => setTo(e.target.value)}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} — {c.name}
          </option>
        ))}
      </select>

      {/* CONVERT BUTTON */}
      <button
        onClick={doConvert}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "18px",
          background: "linear-gradient(90deg,#00b4d8,#0077b6)",
          borderRadius: "15px",
          fontSize: "20px",
          border: "none",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Convert
      </button>

      {/* RESULT */}
      {result && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            background: "#0d1116",
            borderRadius: "10px",
            border: "1px solid #243040",
          }}
        >
          <h3 style={{ margin: 0 }}>Result</h3>
          <p style={{ marginTop: "10px", fontSize: "23px", fontWeight: "600" }}>
            {amount} {from} ={" "}
            {result.result.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}{" "}
            {to}
          </p>
          <p style={{ marginTop: "5px", opacity: 0.6 }}>
            Live rate: {result.rate.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}
