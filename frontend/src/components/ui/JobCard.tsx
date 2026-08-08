import React from 'react';

export interface JobCardProps {
  title: string;
  description: string;
  budget: string;
  tags: string[];
}

export function JobCard({ title, description, budget, tags }: JobCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <span className="text-emerald-400 font-medium px-3 py-1 bg-emerald-400/10 rounded-full text-sm">
          {budget}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-6 line-clamp-2">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="px-2.5 py-1 text-xs font-medium bg-white/5 text-gray-300 rounded-md border border-white/5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
