export const metadata = {
  title: "FX Rates Real Time | Currency Converter",
  description:
    "Exchange Rate & Currency Converter – live foreign currency rates in real time. Mid-market FX rates from ECB / Frankfurter.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          padding: "22px 14px",
          background:
            "radial-gradient(circle at 20% 0%, rgba(30,41,59,0.95), rgba(2,6,23,1) 70%)",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: "#E5E7EB",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "520px" }}>{children}</div>
      </body>
    </html>
  );
}
