"use client";

import { Geist, Geist_Mono } from "next/font/google";
import LoadingIndicator from "@/components/LoadingIndicator";
import NotificationProvider from "@/components/NotificationProvider"; // Importar NotificationProvider
import "./globals.css";

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
        <NotificationProvider>
          <LoadingIndicator />
          <div className="min-h-screen">{children}</div>
        </NotificationProvider>
      </body>
    </html>
  );
}
