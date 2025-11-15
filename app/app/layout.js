export const metadata = {
  title: "FX Converter",
  description: "Global currency converter (fast, accurate, clean).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 20, fontFamily: "Arial" }}>
        {children}
      </body>
    </html>
  );
}
