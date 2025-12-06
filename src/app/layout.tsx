import type { Metadata } from "next";
import localFont from "next/font/local"
import "./globals.css";
import NavBar, { PagePath } from "./navbar";
import ConfigProvider from "@/components/configprovider";

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

export interface HekinavConfig {
  paths: PagePath[],
  mapStyle: string
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hekinavConfig: HekinavConfig = {
    paths: [{ n: "Home", p: "/" }, { n: "Routing", p: "/routing" }, { n: "Test", p: "/test" }],
    mapStyle: "/style.json"
  }
  const paths = hekinavConfig.paths
  return (
    <html lang="en">
      <body
        className={`${gothamRounded.variable} ${gothamXNarrow.variable} antialiased min-h-screen `}
      >
        <div className="h-screen flex flex-col overflow-hidden">
          <NavBar paths={paths}></NavBar>
          <div style={{height: "calc(100vh - calc(var(--spacing) * 15))"}}>
            <ConfigProvider config={hekinavConfig}>
              {children}
            </ConfigProvider>
          </div>
        </div>

      </body>
    </html>
  );
}
