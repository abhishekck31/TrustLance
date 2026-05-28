"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { ShieldCheck, Layers, FileText, CheckCircle2, ChevronRight, Scale, Zap, Globe, Github, Twitter } from "lucide-react";
import { useRef } from "react";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="relative min-h-screen overflow-hidden" ref={ref}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 blur-[120px] rounded-full animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/20 blur-[120px] rounded-full animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-accent/20 blur-[120px] rounded-full animate-blob animation-delay-4000" />
      </div>

      <HeroSection y1={y1} opacity={opacity} />
      <StatsSection />
      <FeaturesSection />
      <WorkflowTimeline />
      <DAOSection />
      <Footer />
    </div>
  );
}

function HeroSection({ y1, opacity }: any) {
  return (
    <motion.section 
      style={{ y: y1, opacity }}
      className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-gray-300 mb-8 border-primary/30">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Audited Smart Contracts on Polygon</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] mb-6">
          Trustless Freelance <br />
          Payments Built <GradientText>On-Chain</GradientText>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          Lock funds securely, release them via transparent milestones, and resolve disputes fairly through decentralized governance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <AnimatedButton variant="primary" className="w-full sm:w-auto text-lg px-8 py-4">
              Launch App
              <ChevronRight className="inline ml-2 w-5 h-5" />
            </AnimatedButton>
          </Link>
          <Link href="/docs">
            <AnimatedButton variant="outline" className="w-full sm:w-auto text-lg px-8 py-4">
              Read Documentation
            </AnimatedButton>
          </Link>
        </div>
      </motion.div>

      {/* Floating Hero Visuals */}
      <motion.div 
        className="mt-20 w-full max-w-5xl relative h-[400px] md:h-[500px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 bottom-0 h-32 mt-auto" />
        
        <GlassCard className="absolute top-10 left-0 md:left-[10%] w-[280px] z-20 animate-float border-primary/20 bg-[#0a0a0a]/80">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Layers className="text-blue-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Milestone 1</p>
              <p className="font-bold">Frontend UI</p>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
            <div className="bg-primary h-2 rounded-full w-full" />
          </div>
          <p className="text-right text-xs text-primary font-semibold">100% Approved</p>
        </GlassCard>

        <GlassCard className="absolute top-32 right-0 md:right-[10%] w-[300px] z-20 animate-float border-secondary/20 bg-[#0a0a0a]/80" style={{ animationDelay: "2s" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <FileText className="text-purple-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Escrow Funded</p>
              <p className="font-bold text-lg">2,500 USDC</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            Locked in Smart Contract
          </div>
        </GlassCard>
      </motion.div>
    </motion.section>
  );
}

function StatsSection() {
  const stats = [
    { label: "Total Escrow Volume", value: "$12M+" },
    { label: "Active Freelancers", value: "8,400+" },
    { label: "Jobs Completed", value: "24,000+" },
    { label: "Platform Fees", value: "0%" },
  ];

  return (
    <section className="py-20 border-y border-border bg-black/40">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.value}</p>
            <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-32 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Designed for Web3 Professionals</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to work remotely with zero trust issues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard hoverEffect className="md:col-span-2 min-h-[300px] flex flex-col justify-end p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <Zap className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-2">Smart Contract Escrow</h3>
          <p className="text-gray-400 max-w-md">Funds are locked transparently on the blockchain. The client cannot revoke them, and the freelancer cannot take them until the milestone is approved.</p>
        </GlassCard>

        <GlassCard hoverEffect className="min-h-[300px] flex flex-col justify-end p-8 border-secondary/20">
          <Scale className="w-10 h-10 text-secondary mb-4" />
          <h3 className="text-2xl font-bold mb-2">DAO Dispute</h3>
          <p className="text-gray-400">Randomly selected, staked jurors resolve conflicts fairly.</p>
        </GlassCard>

        <GlassCard hoverEffect className="min-h-[300px] flex flex-col justify-end p-8 border-accent/20">
          <Globe className="w-10 h-10 text-accent mb-4" />
          <h3 className="text-2xl font-bold mb-2">Global & Borderless</h3>
          <p className="text-gray-400">No bank accounts needed. Get paid in USDC or MATIC instantly anywhere.</p>
        </GlassCard>

        <GlassCard hoverEffect className="md:col-span-2 min-h-[300px] flex flex-col justify-end p-8 border-gray-800">
          <Layers className="w-10 h-10 text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Milestone Tracking</h3>
          <p className="text-gray-400 max-w-md">Break massive projects down into bite-sized deliverables. Maintain constant cash flow as you hit your targets.</p>
        </GlassCard>
      </div>
    </section>
  );
}

function WorkflowTimeline() {
  const steps = [
    { title: "Create Job", desc: "Client defines milestones and total budget." },
    { title: "Fund Escrow", desc: "Client locks USDC into the audited smart contract." },
    { title: "Submit Work", desc: "Freelancer uploads proof of work to IPFS." },
    { title: "Approve & Release", desc: "Client approves, and funds are instantly pulled." },
  ];

  return (
    <section className="py-32 bg-black/40 relative">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/50 before:to-transparent">
          {steps.map((step, i) => (
            <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {i + 1}
              </div>
              <GlassCard className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 !rounded-xl">
                <h3 className="font-bold text-xl mb-1 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DAOSection() {
  return (
    <section className="py-32 max-w-7xl mx-auto px-6 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Decentralized Justice</h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Conflicts happen. When a milestone is rejected unjustly, our DAO steps in. Staked jurors review IPFS evidence and vote on the outcome. The majority rules, and the contract executes the verdict automatically.
          </p>
          <AnimatedButton variant="secondary">Become a Juror</AnimatedButton>
        </div>
        <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[500px]">
          <div className="absolute inset-0 glow-effect opacity-50 rounded-full" />
          <GlassCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] border-secondary/30 z-20">
            <h4 className="font-bold mb-4 flex justify-between items-center">
              Active Dispute #842
              <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">Voting</span>
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Freelancer</span>
                  <span className="text-secondary">68%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full w-[68%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Client</span>
                  <span className="text-primary">32%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[32%]" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-black pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2">
          <div className="text-2xl font-bold mb-4">TrustLance</div>
          <p className="text-gray-400 max-w-sm">
            The decentralized escrow standard for remote work and web3 native teams.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Protocol</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="#" className="hover:text-primary transition-colors">Smart Contracts</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Security Audits</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Bug Bounty</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Whitepaper</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Connect</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2"><Twitter className="w-4 h-4"/> Twitter</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2"><Github className="w-4 h-4"/> GitHub</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Discord</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} TrustLance Protocol. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white">Terms</Link>
          <Link href="#" className="hover:text-white">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
