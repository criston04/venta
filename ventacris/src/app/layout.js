"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingIndicator from "@/components/LoadingIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingIndicator />
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
