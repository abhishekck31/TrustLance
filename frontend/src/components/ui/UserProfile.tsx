import React from 'react';

export interface UserProfileProps {
  name: string;
  role: string;
  rating: number;
  totalEarnings: string;
  jobsCompleted: number;
}

export function UserProfile({ name, role, rating, totalEarnings, jobsCompleted }: UserProfileProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1">
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold text-white">
          {name.charAt(0)}
        </div>
      </div>
      
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
        <p className="text-blue-400 font-medium mb-4">{role}</p>
        
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
          <div>
            <div className="text-gray-400 text-sm">Rating</div>
            <div className="text-white font-semibold flex items-center gap-1">
              ⭐ {rating.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Earnings</div>
            <div className="text-emerald-400 font-semibold">{totalEarnings}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Jobs</div>
            <div className="text-white font-semibold">{jobsCompleted}</div>
          </div>
        </div>
      </div>
      
      <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/5">
        View Profile
      </button>
    </div>
  );
}
