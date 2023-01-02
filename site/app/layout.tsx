import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ scrollbarGutter: "stable" }}>
      <head />
      <body>{children}</body>
    </html>
  );
}
