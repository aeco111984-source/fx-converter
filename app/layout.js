export const metadata = {
  title: "FX Converter",
  description: "Live global currency converter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: "system-ui, Arial, sans-serif",
        background: "#f7f7f7"
      }}>
        {children}
      </body>
    </html>
  );
}
