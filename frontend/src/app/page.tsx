import React from 'react';
import Head from 'next/head';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white">
      <Head>
        <title>TrustLance - Web3 Freelance Platform</title>
        <meta name="description" content="The future of decentralized work" />
      </Head>
      
      {/* Navigation placeholder */}
      <nav className="w-full flex justify-between items-center p-6 lg:px-12 backdrop-blur-md bg-black/50 fixed top-0 z-50 border-b border-white/10">
        <div className="text-2xl font-bold tracking-tighter">TrustLance</div>
        <div className="space-x-4">
          <a href="/dashboard" className="text-sm font-medium hover:text-indigo-400 transition">Dashboard</a>
          <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition">
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="pt-24 flex flex-col items-center justify-center space-y-32">
        {/* Sections will be added here */}
      </main>

      {/* Footer placeholder */}
      <footer className="w-full py-8 text-center text-gray-500 text-sm border-t border-white/10 mt-32">
        <p>&copy; {new Date().getFullYear()} TrustLance. All rights reserved.</p>
      </footer>
    </div>
  );
}