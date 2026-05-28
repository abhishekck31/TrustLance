"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge, EscrowStatus } from "@/components/ui/StatusBadge";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Search, Plus, MoreVertical, FileText } from "lucide-react";

export default function JobsPage() {
  const jobs = [
    {
      id: "842",
      title: "Full-Stack Web3 Application",
      client: "0x4F...3B1a",
      freelancer: "You",
      amount: "15,000 USDC",
      status: "InProgress" as EscrowStatus,
      milestones: { total: 5, completed: 2 },
    },
    {
      id: "841",
      title: "Smart Contract Audit",
      client: "0x9A...11fC",
      freelancer: "You",
      amount: "5,000 USDC",
      status: "Funded" as EscrowStatus,
      milestones: { total: 1, completed: 0 },
    },
    {
      id: "839",
      title: "Logo & Branding Design",
      client: "0x22...55dB",
      freelancer: "You",
      amount: "800 USDC",
      status: "Completed" as EscrowStatus,
      milestones: { total: 1, completed: 1 },
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search jobs by ID or Title..." 
            className="w-full bg-surface border border-border rounded-xl py-2 pl-10 pr-4 outline-none focus:border-primary transition-colors text-sm"
          />
        </div>
        <AnimatedButton variant="primary" className="!py-2 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Job
        </AnimatedButton>
      </div>

      {/* Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <GlassCard key={job.id} hoverEffect className="flex flex-col group cursor-pointer">
            
            <div className="flex justify-between items-start mb-4">
              <StatusBadge status={job.status} />
              <button className="text-gray-500 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-gray-400 text-sm">Job #{job.id}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Client</span>
                <span className="font-mono text-gray-300">{job.client}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Escrow Amount</span>
                <span className="font-bold text-white">{job.amount}</span>
              </div>
            </div>

            {/* Milestone Progress */}
            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Milestones
                </span>
                <span className="font-medium">
                  {job.milestones.completed} / {job.milestones.total}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(job.milestones.completed / job.milestones.total) * 100}%` }}
                />
              </div>
            </div>

          </GlassCard>
        ))}
      </div>
    </div>
  );
}
