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
      <main className="pt-32 pb-16 px-6 lg:px-12 flex flex-col items-center justify-center space-y-32 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 animate-float">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-sm font-medium text-gray-300 mb-4">
            ✨ Welcome to the Future of Work
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Decentralized Talent, <br className="hidden md:block"/> Unstoppable Teams.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
            TrustLance connects top-tier freelance talent with visionary Web3 projects. Secure, transparent, and built on the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Button placeholders */}
            <button className="px-8 py-4 bg-indigo-500 text-white rounded-full font-semibold text-lg hover:bg-indigo-600 transition shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              Hire Talent
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition">
              Find Work
            </button>
          </div>
        </section>

      </main>

      {/* Footer placeholder */}
      <footer className="w-full py-8 text-center text-gray-500 text-sm border-t border-white/10 mt-32">
        <p>&copy; {new Date().getFullYear()} TrustLance. All rights reserved.</p>
      </footer>
    </div>
  );
}