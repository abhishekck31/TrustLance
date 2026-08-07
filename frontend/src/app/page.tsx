import React from 'react';
import Head from 'next/head';
import { GradientText } from '@/components/ui/GradientText';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

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
            <GradientText>Decentralized Talent</GradientText>, <br className="hidden md:block"/> Unstoppable Teams.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
            TrustLance connects top-tier freelance talent with visionary Web3 projects. Secure, transparent, and built on the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <AnimatedButton variant="primary" className="text-lg px-8 py-4">
              Hire Talent
            </AnimatedButton>
            <AnimatedButton variant="outline" className="text-lg px-8 py-4 border border-white/20">
              Find Work
            </AnimatedButton>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            {
              title: 'Smart Escrow',
              desc: 'Funds are locked securely in smart contracts and released only upon milestone completion.',
              icon: '🔒',
            },
            {
              title: 'Zero Middlemen',
              desc: 'Direct peer-to-peer engagement. Keep 100% of what you earn without platform fees.',
              icon: '⚡',
            },
            {
              title: 'Global Talent',
              desc: 'Access a worldwide pool of verified Web3 experts, developers, and designers.',
              icon: '🌍',
            },
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 group relative z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10" />
              <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Trusted By Section */}
        <section className="w-full flex flex-col items-center pt-16 border-t border-white/5">
          <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-8">Trusted by leading Web3 teams</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Ethereum', 'Polygon', 'ConsenSys', 'Chainlink', 'Arbitrum'].map((company, idx) => (
              <span key={idx} className="text-xl md:text-2xl font-bold tracking-tighter text-white">
                {company}
              </span>
            ))}
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