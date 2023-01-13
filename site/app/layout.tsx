import Navbar from "../components/Navbar";
import Context from "./Context";
import "./globals.css";

function RootLayout({ children, ...pageProps }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollbarGutter: "stable" }}>
      <head>
        <title>marvel.</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body>
        <Context>
          {/* <Navbar /> */}
          {children}
        </Context>
      </body>
    </html>
  );
}

export default RootLayout;
