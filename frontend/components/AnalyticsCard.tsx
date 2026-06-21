// Component implementing Glassmorphism for analytics cards.
import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  color: string; // Tailwind color class (e.g., bg-blue-500/30 border-blue-400)
}

export function AnalyticsCard({ title, value, color }: AnalyticsCardProps) {
  return (
    <div className={`p-6 rounded-xl shadow-lg transition duration-300 
                    bg-white/15 backdrop-blur-md border ${color}`}>
      <h3 className="text-xl font-semibold text-gray-200 mb-2">{title}</h3>
      <p className="text-4xl font-extrabold text-white mb-4">
        {value}
      </p>
      <div className={`text-sm font-medium ${color.replace('bg-', 'text-')}`}>
        Current Metric
      </div>
    </div>
  );
}