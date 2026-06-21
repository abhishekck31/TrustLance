// This file will be modified to introduce global styles and the animated background effect.
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustLance",
  description: "Web3 Monorepo Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply custom background styling here */}
      <body className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-100 bg-[radial-gradient(circle_at_center,_var(--tw-color-indigo-50)_0%,_var(--tw-color-gray-50)_100%)] animate-pulse-slow">
        {children}
      </body>
    </html>
  );
}