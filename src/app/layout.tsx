import type { Metadata } from "next";
import localFont from "next/font/local"
import "./globals.css";
import NavBar from "./navbar";

const gothamRounded = localFont({
  src: './fonts/gotham-rounded-medium.woff2',
  variable: "--gotham-rounded"
})
const gothamXNarrow = localFont({
  src: './fonts/gotham-xnarrow-medium.woff2',
  variable: "--gotham-xnarrow"
})

export const metadata: Metadata = {
  title: "Hekinav",
  description: "Public transport routing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paths = process.env.PATHS ? JSON.parse(process.env.PATHS) : []
  return (
    <html lang="en">
      <body
        className={`${gothamRounded.variable} ${gothamXNarrow.variable} antialiased min-h-screen `}
      >
        <div className="h-screen flex flex-col">
          <NavBar paths={paths}></NavBar>
          <div className="grow">
            {children}
          </div>
        </div>

      </body>
    </html>
  );
}
