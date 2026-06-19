'use client';

import React from 'react';
import { ArrowRight, Clock, DollarSign } from 'lucide-react';

// --- Mock Data Types (Based on expected backend response) ---
interface DisputedProject {
  id: string;
  name: string;
  status: 'Disputed' | 'Voting';
  currentVotes: number;
}

interface VotingTimeline {
  projectId: string;
  projectName: string;
  votesRemaining: number;
  endDate: string;
}

interface StakingMetric {
  projectId: string;
  stakedAmount: number;
  totalReward: number;
}

// --- Mock Data Fetching Function (Simulating API call) ---
async function fetchDashboardData(): Promise<{ disputedProjects: DisputedProject[], openVotingTimelines: VotingTimeline[], stakingPoolMetrics: StakingMetric[] }> {
  // In a real application, this would be an actual fetch('/api/dashboard') call.
  // We use mock data here to demonstrate the UI structure execution.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

  return {
    disputedProjects: [
      { id: 'p1', name: 'QuantumLeap Token Dispute', status: 'Voting', currentVotes: 15 },
      { id: 'p2', name: 'AI Ethics Protocol Vote', status: 'Disputed', currentVotes: 42 },
    ],
    openVotingTimelines: [
      { projectId: 'p1', projectName: 'QuantumLeap Token Dispute', votesRemaining: 5, endDate: '2024-08-30' },
      { projectId: 'p2', projectName: 'AI Ethics Protocol Vote', votesRemaining: 10, endDate: '2024-09-15' },
    ],
    stakingPoolMetrics: [
      { projectId: 'p1', stakedAmount: 150000, totalReward: 5000.50 },
      { projectId: 'p2', stakedAmount: 85000, totalReward: 2100.75 },
    ],
  };
}

// --- Component Functions ---

const DisputedProjectsCard: React.FC<{ project: DisputedProject }> = ({ project }) => (
  <div className="bg-white p-6 rounded-xl shadow border border-red-200 transition duration-300 hover:shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
    <p className={`text-sm font-medium mb-4 ${project.status === 'Voting' ? 'text-blue-600' : 'text-red-600'}`}>
      Status: {project.status}
    </p>
    <div className="space-y-2">
      <p>Current Votes: <span className="font-semibold text-lg text-indigo-600">{project.currentVotes}</span></p>
      <button className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
        View Details & Vote
      </button>
    </div>
  </div>
);

const VotingTimelineCard: React.FC<{ timeline: VotingTimeline }> = ({ timeline }) => (
  <div className="bg-white p-5 rounded-xl shadow border border-blue-200 flex justify-between items-center">
    <div>
      <h4 className="text-lg font-semibold text-gray-800">{timeline.projectName}</h4>
      <p className="text-sm text-gray-600 mt-1">Project ID: {timeline.projectId}</p>
    </div>
    <div className="text-right">
      <div className="flex items-center text-blue-600 font-medium mb-2"><Clock className="w-5 h-5 mr-2" /> Timeline Ends:</div>
      <span className="text-xl font-bold">{timeline.endDate}</span>
    </div>
  </div>
);

const StakingMetricsCard: React.FC<{ metric: StakingMetric }> = ({ metric }) => (
  <div className="bg-white p-5 rounded-xl shadow border border-green-200 flex justify-between items-center">
    <div>
      <h4 className="text-lg font-semibold text-gray-800">Staking Pool: {metric.projectId}</h4>
      <p className="text-sm text-gray-600 mt-1">Total Staked: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(metric.stakedAmount)}</p>
    </div>
    <div className="text-right">
      <div className="flex items-center text-green-600 font-medium mb-2"><DollarSign className="w-5 h-5 mr-2" /> Total Reward:</div>
      <span className="text-xl font-bold text-green-700">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(metric.totalReward)}</span>
    </div>
  </div>
);


// --- Main Dashboard Page ---

export default async function JurorDashboard() {
  const data = await fetchDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-10 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
          TrustLance Juror Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Your portal for disputed projects, voting timelines, and staking metrics.</p>
      </header>

      {/* Section 1: Disputed Projects */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Disputed Projects</h2>
        {data.disputedProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.disputedProjects.map(project => (
              <DisputedProjectsCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-xl shadow">
            <p className="text-xl text-gray-500">No disputed projects currently listed.</p>
          </div>
        )}
      </section>

      {/* Section 2: Open Voting Timelines */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Open Voting Timelines</h2>
        {data.openVotingTimelines.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.openVotingTimelines.map(timeline => (
              <VotingTimelineCard key={timeline.projectId} timeline={timeline} />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-xl shadow">
            <p className="text-xl text-gray-500">No active voting timelines found.</p>
          </div>
        )}
      </section>

      {/* Section 3: Staking Pool Metrics */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Staking Pool Metrics</h2>
        {data.stakingPoolMetrics.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {data.stakingPoolMetrics.map(metric => (
              <StakingMetricsCard key={metric.projectId} metric={metric} />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-xl shadow">
            <p className="text-xl text-gray-500">No staking pool metrics found.</p>
          </div>
        )}
      </section>

    </div>
  );
}