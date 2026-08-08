import React from 'react';

export function StatsOverview() {
  const stats = [
    { label: 'Total Value Locked', value: '$1.2M', change: '+12.5%' },
    { label: 'Active Freelancers', value: '2,400+', change: '+5.2%' },
    { label: 'Jobs Completed', value: '15,000+', change: '+18.1%' },
    { label: 'Dispute Rate', value: '< 1%', change: '-0.5%' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          
          <div className="text-gray-400 text-sm mb-2 font-medium">{stat.label}</div>
          <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
          <div className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-blue-400'}`}>
            {stat.change} this month
          </div>
        </div>
      ))}
    </div>
  );
}
