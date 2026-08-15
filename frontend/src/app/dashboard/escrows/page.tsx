"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import {
  Wallet, Plus, Search, ArrowUpRight, ArrowDownLeft, Shield,
  Clock, CheckCircle2, AlertTriangle, Lock, Unlock, ChevronDown,
  ChevronUp, Copy, ExternalLink, FileText, Users
} from "lucide-react";

type EscrowState = "Created" | "Locked" | "Released" | "Disputed";

interface EscrowMilestone {
  id: number;
  title: string;
  amount: string;
  status: "pending" | "active" | "approved" | "released";
}

interface Escrow {
  id: string;
  title: string;
  client: string;
  freelancer: string;
  totalAmount: string;
  state: EscrowState;
  createdAt: string;
  milestones: EscrowMilestone[];
  txHash: string;
}

const escrows: Escrow[] = [
  {
    id: "ESC-001",
    title: "Full-Stack Web3 Application",
    client: "0x4F7c...3B1a",
    freelancer: "0x71C7...976F",
    totalAmount: "15,000 USDC",
    state: "Locked",
    createdAt: "Aug 10, 2026",
    txHash: "0xabc123...def456",
    milestones: [
      { id: 1, title: "Project Setup & Architecture", amount: "2,000 USDC", status: "released" },
      { id: 2, title: "Smart Contract Development", amount: "5,000 USDC", status: "approved" },
      { id: 3, title: "Frontend Integration", amount: "5,000 USDC", status: "active" },
      { id: 4, title: "Testing & Deployment", amount: "3,000 USDC", status: "pending" },
    ],
  },
  {
    id: "ESC-002",
    title: "Smart Contract Security Audit",
    client: "0x9A22...11fC",
    freelancer: "0x71C7...976F",
    totalAmount: "5,000 USDC",
    state: "Created",
    createdAt: "Aug 14, 2026",
    txHash: "0x789abc...123def",
    milestones: [
      { id: 1, title: "Full Audit Report", amount: "5,000 USDC", status: "pending" },
    ],
  },
  {
    id: "ESC-003",
    title: "Logo & Brand Identity",
    client: "0x22BB...55dB",
    freelancer: "0x71C7...976F",
    totalAmount: "800 USDC",
    state: "Released",
    createdAt: "Jul 28, 2026",
    txHash: "0xfed987...654abc",
    milestones: [
      { id: 1, title: "Logo Design & Brand Kit", amount: "800 USDC", status: "released" },
    ],
  },
  {
    id: "ESC-004",
    title: "DeFi Yield Aggregator",
    client: "0xBB44...77eA",
    freelancer: "0x71C7...976F",
    totalAmount: "25,000 USDC",
    state: "Disputed",
    createdAt: "Jul 15, 2026",
    txHash: "0x456xyz...789uvw",
    milestones: [
      { id: 1, title: "Protocol Architecture", amount: "5,000 USDC", status: "released" },
      { id: 2, title: "Vault Strategy Contracts", amount: "8,000 USDC", status: "approved" },
      { id: 3, title: "Frontend Dashboard", amount: "7,000 USDC", status: "active" },
      { id: 4, title: "Mainnet Launch", amount: "5,000 USDC", status: "pending" },
    ],
  },
];

const stateConfig: Record<EscrowState, { icon: typeof Lock; color: string; bg: string; border: string }> = {
  Created: { icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  Locked: { icon: Lock, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  Released: { icon: Unlock, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Disputed: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

const milestoneStatusStyles: Record<string, string> = {
  pending: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  active: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  approved: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  released: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function EscrowsPage() {
  const [expandedEscrow, setExpandedEscrow] = useState<string | null>("ESC-001");
  const [filter, setFilter] = useState<EscrowState | "All">("All");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredEscrows = filter === "All" ? escrows : escrows.filter((e) => e.state === filter);

  // Stats
  const totalLocked = escrows.filter((e) => e.state === "Locked").length;
  const totalReleased = escrows.filter((e) => e.state === "Released").length;
  const totalDisputed = escrows.filter((e) => e.state === "Disputed").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Escrows", value: escrows.length.toString(), icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
          { label: "Active (Locked)", value: totalLocked.toString(), icon: Lock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Released", value: totalReleased.toString(), icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Disputed", value: totalDisputed.toString(), icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
        ].map((stat, i) => (
          <GlassCard key={i} className="!p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {(["All", "Created", "Locked", "Released", "Disputed"] as const).map((state) => (
            <button
              key={state}
              onClick={() => setFilter(state)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                filter === state
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-white/5 text-gray-400 border-border hover:bg-white/10 hover:text-white"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
        <AnimatedButton
          variant="primary"
          className="!py-2 flex items-center gap-2"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="w-5 h-5" />
          New Escrow
        </AnimatedButton>
      </div>

      {/* Create Escrow Form */}
      {showCreateForm && (
        <GlassCard className="border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Create New Escrow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Smart Contract Development"
                className="w-full bg-surface border border-border rounded-xl py-2.5 px-4 outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Recipient Address</label>
              <input
                type="text"
                placeholder="0x..."
                className="w-full bg-surface border border-border rounded-xl py-2.5 px-4 outline-none focus:border-primary transition-colors text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Total Amount (USDC)</label>
              <input
                type="number"
                placeholder="10000"
                className="w-full bg-surface border border-border rounded-xl py-2.5 px-4 outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Number of Milestones</label>
              <input
                type="number"
                placeholder="3"
                min={1}
                max={10}
                className="w-full bg-surface border border-border rounded-xl py-2.5 px-4 outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <AnimatedButton variant="primary" className="!py-2 !px-6 text-sm">
              Deploy Escrow Contract
            </AnimatedButton>
          </div>
        </GlassCard>
      )}

      {/* Escrow List */}
      <div className="space-y-4">
        {filteredEscrows.map((escrow) => {
          const config = stateConfig[escrow.state];
          const StateIcon = config.icon;
          const isExpanded = expandedEscrow === escrow.id;
          const completedMilestones = escrow.milestones.filter(
            (m) => m.status === "released" || m.status === "approved"
          ).length;
          const progress = (completedMilestones / escrow.milestones.length) * 100;

          return (
            <GlassCard key={escrow.id} hoverEffect className="!p-0 overflow-hidden">
              {/* Main Row */}
              <button
                onClick={() => setExpandedEscrow(isExpanded ? null : escrow.id)}
                className="w-full text-left p-5 flex items-center gap-4"
              >
                {/* State Icon */}
                <div className={`p-3 rounded-xl ${config.bg} shrink-0`}>
                  <StateIcon className={`w-5 h-5 ${config.color}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-base truncate">{escrow.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${config.bg} ${config.color} ${config.border}`}>
                      {escrow.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-mono">{escrow.id}</span>
                    <span>·</span>
                    <span>{escrow.createdAt}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {completedMilestones}/{escrow.milestones.length} milestones
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-lg">{escrow.totalAmount}</p>
                  <div className="w-32 bg-gray-800 rounded-full h-1.5 overflow-hidden mt-2">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Expand Toggle */}
                <div className="shrink-0 ml-2">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="border-t border-border px-5 py-5 bg-white/[0.01] animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Parties */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4" /> Parties
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Client</span>
                          <span className="font-mono text-gray-300 flex items-center gap-1">
                            {escrow.client}
                            <Copy className="w-3 h-3 text-gray-500 hover:text-white cursor-pointer" />
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Freelancer</span>
                          <span className="font-mono text-gray-300 flex items-center gap-1">
                            {escrow.freelancer}
                            <Copy className="w-3 h-3 text-gray-500 hover:text-white cursor-pointer" />
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Tx Hash</span>
                          <span className="font-mono text-primary flex items-center gap-1 cursor-pointer hover:underline">
                            {escrow.txHash}
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="lg:col-span-2">
                      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4" /> Milestones
                      </h4>
                      <div className="space-y-2">
                        {escrow.milestones.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between p-3 bg-white/[0.02] border border-border/50 rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-gray-400">
                                {m.id}
                              </span>
                              <span className="text-sm font-medium">{m.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-mono text-gray-300">{m.amount}</span>
                              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border capitalize ${milestoneStatusStyles[m.status]}`}>
                                {m.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      {escrow.state === "Locked" && (
                        <div className="flex gap-3 mt-4">
                          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                            <ArrowUpRight className="w-4 h-4" />
                            Release Milestone
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors">
                            <AlertTriangle className="w-4 h-4" />
                            Raise Dispute
                          </button>
                        </div>
                      )}
                      {escrow.state === "Created" && (
                        <div className="flex gap-3 mt-4">
                          <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors">
                            <ArrowDownLeft className="w-4 h-4" />
                            Fund Escrow
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
