import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ className: "font-sans" });

export const metadata: Metadata = {
  title: "TrustLance Wallet Connect",
  description: "Wallet connection layout with role selection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}