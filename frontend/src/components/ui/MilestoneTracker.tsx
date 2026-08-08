import React from 'react';

export interface Milestone {
  id: string;
  title: string;
  amount: string;
  status: 'locked' | 'in_progress' | 'completed';
}

export function MilestoneTracker({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Project Milestones</h3>
      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="relative flex items-start gap-4">
            {/* Connecting line */}
            {index < milestones.length - 1 && (
              <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 bg-white/10" />
            )}
            
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10
              ${milestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                milestone.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 
                'bg-gray-500/20 text-gray-400'}
            `}>
              {milestone.status === 'completed' ? '✓' : index + 1}
            </div>
            
            <div className="flex-1 pb-2">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-white font-medium">{milestone.title}</h4>
                <span className="text-gray-300">{milestone.amount}</span>
              </div>
              <p className="text-sm capitalize text-gray-400">
                {milestone.status.replace('_', ' ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
