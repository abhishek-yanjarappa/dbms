import Appbar from "../components/Navbar";
import Context from "./Context";
import "./global.css";

function RootLayout({ children, ...pageProps }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollbarGutter: "stable" }}>
      <head>
        <title>UVCE DBMS Project</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body>
        <Context>
          <Appbar />
          {children}
        </Context>
      </body>
    </html>
  );
}

export default RootLayout;
