import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrustLance | Decentralized Escrow",
  description: "Web3 remote jobs and freelance escrow platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <nav className="glass w-full p-4 flex justify-between items-center sticky top-0 z-50">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            TrustLance
          </div>
          <div>
            {/* Wallet Connect Button Placeholder */}
            <button className="bg-primary hover:bg-accent transition-all px-4 py-2 rounded-lg font-medium">
              Connect Wallet
            </button>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="glass p-6 text-center text-sm text-gray-400 mt-auto">
          &copy; {new Date().getFullYear()} TrustLance Protocol. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
