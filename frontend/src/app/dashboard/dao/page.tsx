"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import {
  Scale, Vote, Clock, CheckCircle2, XCircle, Users, TrendingUp,
  AlertTriangle, ChevronRight, Timer, BarChart3, Sparkles,
  ThumbsUp, ThumbsDown, Minus
} from "lucide-react";

type ProposalStatus = "Active" | "Passed" | "Rejected" | "Pending";

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorum: number;
  deadline: string;
  timeLeft: string;
  category: string;
  stakeRequired: string;
}

const proposals: Proposal[] = [
  {
    id: "TLP-012",
    title: "Reduce Platform Fee from 2.5% to 1.5%",
    description: "This proposal aims to lower the platform commission fee from 2.5% to 1.5% on all escrow transactions to attract more freelancers and clients. The reduction would be offset by the expected increase in transaction volume based on competitive analysis.",
    proposer: "0x4F7c...3B1a",
    status: "Active",
    votesFor: 847200,
    votesAgainst: 312400,
    votesAbstain: 45800,
    quorum: 1000000,
    deadline: "Aug 20, 2026",
    timeLeft: "4d 12h",
    category: "Treasury",
    stakeRequired: "100 TLT",
  },
  {
    id: "TLP-011",
    title: "Add Support for Arbitrum L2 Deployment",
    description: "Deploy TrustLance core contracts (Escrow, Reputation, Governance) on Arbitrum One to offer lower gas fees. Estimated development cost: 15,000 USDC from treasury. This will reduce average transaction costs by ~95% for users.",
    proposer: "0x9A22...11fC",
    status: "Active",
    votesFor: 1245000,
    votesAgainst: 89000,
    votesAbstain: 120000,
    quorum: 1000000,
    deadline: "Aug 18, 2026",
    timeLeft: "2d 6h",
    category: "Infrastructure",
    stakeRequired: "100 TLT",
  },
  {
    id: "TLP-010",
    title: "Implement Quadratic Voting for Dispute Resolution",
    description: "Replace the current stake-weighted voting model with quadratic voting for dispute resolution. This ensures fairer outcomes where large token holders cannot single-handedly decide dispute outcomes, improving juror decentralization.",
    proposer: "0xBB44...77eA",
    status: "Passed",
    votesFor: 1560000,
    votesAgainst: 340000,
    votesAbstain: 100000,
    quorum: 1000000,
    deadline: "Aug 12, 2026",
    timeLeft: "Ended",
    category: "Governance",
    stakeRequired: "100 TLT",
  },
  {
    id: "TLP-009",
    title: "Increase Minimum Juror Stake to 500 TLT",
    description: "Raise the minimum staking threshold for juror eligibility from 100 TLT to 500 TLT to filter out less committed participants and increase the quality of dispute resolution.",
    proposer: "0x22BB...55dB",
    status: "Rejected",
    votesFor: 230000,
    votesAgainst: 890000,
    votesAbstain: 180000,
    quorum: 1000000,
    deadline: "Aug 8, 2026",
    timeLeft: "Ended",
    category: "Governance",
    stakeRequired: "100 TLT",
  },
  {
    id: "TLP-008",
    title: "Launch TrustLance Grants Program (50,000 USDC)",
    description: "Allocate 50,000 USDC from the DAO treasury to fund open-source tools, integrations, and educational content that grow the TrustLance ecosystem. Grants committee of 5 elected members will review applications quarterly.",
    proposer: "0x4F7c...3B1a",
    status: "Pending",
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    quorum: 1000000,
    deadline: "Aug 25, 2026",
    timeLeft: "9d 0h",
    category: "Treasury",
    stakeRequired: "250 TLT",
  },
];

const statusConfig: Record<ProposalStatus, { color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  Active: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Vote },
  Passed: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 },
  Rejected: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle },
  Pending: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock },
};

const categoryColors: Record<string, string> = {
  Treasury: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Infrastructure: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  Governance: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

export default function GovernancePage() {
  const [filter, setFilter] = useState<ProposalStatus | "All">("All");
  const [expandedProposal, setExpandedProposal] = useState<string | null>("TLP-012");
  const [userVotes, setUserVotes] = useState<Record<string, "for" | "against" | "abstain">>({});

  const filteredProposals = filter === "All" ? proposals : proposals.filter((p) => p.status === filter);

  // Stats
  const activeCount = proposals.filter((p) => p.status === "Active").length;
  const passedCount = proposals.filter((p) => p.status === "Passed").length;
  const totalVoters = "2,847";

  const handleVote = (proposalId: string, vote: "for" | "against" | "abstain") => {
    setUserVotes((prev) => ({ ...prev, [proposalId]: vote }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            <GradientText>DAO Governance</GradientText>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Vote on proposals that shape the TrustLance protocol</p>
        </div>
        <AnimatedButton variant="primary" className="!py-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Create Proposal
        </AnimatedButton>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Proposals", value: activeCount.toString(), icon: Vote, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Passed This Month", value: passedCount.toString(), icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Total Voters", value: totalVoters, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Your Voting Power", value: "1,250 TLT", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["All", "Active", "Pending", "Passed", "Rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              filter === status
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-white/5 text-gray-400 border-border hover:bg-white/10 hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => {
          const config = statusConfig[proposal.status];
          const StatusIcon = config.icon;
          const isExpanded = expandedProposal === proposal.id;
          const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
          const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
          const againstPercent = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
          const abstainPercent = totalVotes > 0 ? (proposal.votesAbstain / totalVotes) * 100 : 0;
          const quorumPercent = Math.min((totalVotes / proposal.quorum) * 100, 100);
          const hasVoted = userVotes[proposal.id];

          return (
            <GlassCard key={proposal.id} hoverEffect className="!p-0 overflow-hidden">
              {/* Header Row */}
              <button
                onClick={() => setExpandedProposal(isExpanded ? null : proposal.id)}
                className="w-full text-left p-5 flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl ${config.bg} shrink-0`}>
                  <StatusIcon className={`w-5 h-5 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-bold text-base">{proposal.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${config.bg} ${config.color} ${config.border}`}>
                      {proposal.status}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${categoryColors[proposal.category]}`}>
                      {proposal.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-mono">{proposal.id}</span>
                    <span>·</span>
                    <span>by {proposal.proposer}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {proposal.timeLeft}
                    </span>
                  </div>
                </div>

                {/* Quick Vote Bar */}
                {totalVotes > 0 && (
                  <div className="shrink-0 w-40 hidden sm:block">
                    <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 transition-all duration-700" style={{ width: `${forPercent}%` }} />
                      <div className="bg-red-500 transition-all duration-700" style={{ width: `${againstPercent}%` }} />
                      <div className="bg-gray-500 transition-all duration-700" style={{ width: `${abstainPercent}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 text-right">
                      {(totalVotes / 1000).toFixed(0)}k votes
                    </p>
                  </div>
                )}

                <ChevronRight className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-border px-5 py-5 bg-white/[0.01] animate-in fade-in slide-in-from-top-1 duration-200">
                  
                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">{proposal.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Vote Breakdown */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-4">
                        <BarChart3 className="w-4 h-4" /> Vote Breakdown
                      </h4>
                      <div className="space-y-3">
                        {/* For */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" /> For
                            </span>
                            <span className="text-gray-300">
                              {(proposal.votesFor / 1000).toFixed(0)}k ({forPercent.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-700"
                              style={{ width: `${forPercent}%` }}
                            />
                          </div>
                        </div>
                        
                        {/* Against */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-red-400 font-medium flex items-center gap-1">
                              <ThumbsDown className="w-3 h-3" /> Against
                            </span>
                            <span className="text-gray-300">
                              {(proposal.votesAgainst / 1000).toFixed(0)}k ({againstPercent.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-700"
                              style={{ width: `${againstPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Abstain */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400 font-medium flex items-center gap-1">
                              <Minus className="w-3 h-3" /> Abstain
                            </span>
                            <span className="text-gray-300">
                              {(proposal.votesAbstain / 1000).toFixed(0)}k ({abstainPercent.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-gray-600 to-gray-400 h-full rounded-full transition-all duration-700"
                              style={{ width: `${abstainPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Quorum */}
                        <div className="mt-4 pt-3 border-t border-border">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Quorum Progress</span>
                            <span className={`font-medium ${quorumPercent >= 100 ? "text-emerald-400" : "text-yellow-400"}`}>
                              {quorumPercent.toFixed(0)}% ({(totalVotes / 1000).toFixed(0)}k / {(proposal.quorum / 1000).toFixed(0)}k)
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                quorumPercent >= 100 ? "bg-emerald-500" : "bg-yellow-500"
                              }`}
                              style={{ width: `${quorumPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cast Vote */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-4">
                        <Vote className="w-4 h-4" /> Cast Your Vote
                      </h4>
                      
                      {proposal.status === "Active" && !hasVoted ? (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-500 mb-3">
                            Your voting power: <span className="text-white font-medium">1,250 TLT</span> · 
                            Stake required: <span className="text-white font-medium">{proposal.stakeRequired}</span>
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              onClick={() => handleVote(proposal.id, "for")}
                              className="flex flex-col items-center gap-2 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/15 transition-all group"
                            >
                              <ThumbsUp className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-medium text-emerald-400">Vote For</span>
                            </button>
                            <button
                              onClick={() => handleVote(proposal.id, "against")}
                              className="flex flex-col items-center gap-2 p-4 bg-red-500/5 border border-red-500/20 rounded-xl hover:bg-red-500/15 transition-all group"
                            >
                              <ThumbsDown className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-medium text-red-400">Vote Against</span>
                            </button>
                            <button
                              onClick={() => handleVote(proposal.id, "abstain")}
                              className="flex flex-col items-center gap-2 p-4 bg-gray-500/5 border border-gray-500/20 rounded-xl hover:bg-gray-500/15 transition-all group"
                            >
                              <Minus className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-medium text-gray-400">Abstain</span>
                            </button>
                          </div>
                        </div>
                      ) : hasVoted ? (
                        <div className={`p-4 rounded-xl border ${
                          hasVoted === "for" ? "bg-emerald-500/5 border-emerald-500/20" :
                          hasVoted === "against" ? "bg-red-500/5 border-red-500/20" :
                          "bg-gray-500/5 border-gray-500/20"
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className={`w-5 h-5 ${
                              hasVoted === "for" ? "text-emerald-400" :
                              hasVoted === "against" ? "text-red-400" :
                              "text-gray-400"
                            }`} />
                            <span className="font-medium text-sm">
                              Vote Cast: <span className="capitalize">{hasVoted}</span>
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Your 1,250 TLT has been counted. Thank you for participating in governance.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 bg-white/[0.02] border border-border rounded-xl">
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            {proposal.status === "Passed" && <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> This proposal has passed and is being implemented.</>}
                            {proposal.status === "Rejected" && <><XCircle className="w-4 h-4 text-red-400" /> This proposal was rejected by the community.</>}
                            {proposal.status === "Pending" && <><Clock className="w-4 h-4 text-yellow-400" /> Voting has not started yet. Stay tuned.</>}
                          </p>
                        </div>
                      )}

                      {/* Proposal Info */}
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Deadline</span>
                          <span className="text-gray-300">{proposal.deadline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Proposer</span>
                          <span className="text-gray-300 font-mono">{proposal.proposer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Min. Stake</span>
                          <span className="text-gray-300">{proposal.stakeRequired}</span>
                        </div>
                      </div>
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
