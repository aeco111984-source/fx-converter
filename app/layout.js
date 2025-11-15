// app/layout.jsx
export const metadata = {
  title: "FX Rates Real Time",
  description:
    "Exchange Rate & Currency Converter – live foreign currency rates in real time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "24px 12px",
          background:
            "radial-gradient(circle at top, #1E293B 0, #020617 40%, #020617 100%)",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: "#E5E7EB",
        }}
      >
        {children}
      </body>
    </html>
  );
}
