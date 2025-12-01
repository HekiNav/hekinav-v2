import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import NavBar from "./navbar";

const rubik = Rubik({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hekinav",
  description: "Public transport rour",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paths = process.env.PATHS ? JSON.parse(process.env.PATHS): []
  return (
    <html lang="en">
      <body
        className={`${rubik.variable} antialiased min-h-screen `}
      >
        <NavBar paths={paths}></NavBar>
        {children}
      </body>
    </html>
  );
}
