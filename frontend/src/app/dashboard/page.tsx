"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { DollarSign, Briefcase, Clock, Activity, ArrowUpRight } from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    { label: "Total Escrowed", value: "$42,500", icon: DollarSign, trend: "+12.5%" },
    { label: "Active Jobs", value: "4", icon: Briefcase, trend: "+1" },
    { label: "Pending Approvals", value: "2", icon: Clock, trend: "-1" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Chart Placeholder */}
        <GlassCard className="lg:col-span-2 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Cash Flow</h3>
            <select className="bg-background border border-border rounded-lg px-3 py-1 text-sm outline-none">
              <option>This Month</option>
              <option>Last Month</option>
              <option>All Time</option>
            </select>
          </div>
          
          {/* Custom SVG Chart Placeholder for Lightweight Analytics */}
          <div className="flex-1 w-full relative flex items-end justify-between px-4 pb-4 mt-auto">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            
            {[40, 70, 45, 90, 65, 85, 120].map((h, i) => (
              <div key={i} className="relative w-12 group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black px-2 py-1 rounded text-xs z-10">
                  ${h * 100}
                </div>
                <div 
                  className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-sm transition-all duration-500 ease-out hover:from-primary/40 hover:to-primary"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Activity Feed</h3>
            <button className="text-primary text-sm hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {[
              { title: "Milestone Approved", desc: "Job: Frontend Overhaul", time: "2h ago", icon: Activity, color: "text-green-400 bg-green-400/10" },
              { title: "Escrow Funded", desc: "Job: Smart Contract Audit", time: "5h ago", icon: ArrowUpRight, color: "text-blue-400 bg-blue-400/10" },
              { title: "Dispute Raised", desc: "Job: Logo Design", time: "1d ago", icon: Activity, color: "text-red-400 bg-red-400/10" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className={`p-2 rounded-full h-fit shrink-0 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
