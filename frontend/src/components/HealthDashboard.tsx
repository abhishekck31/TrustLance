// React component for displaying the dashboard metrics

import React, { useState, useEffect } from 'react';

interface HealthData {
  platformName: string;
  tvl: number;
  totalDisputes: number;
  completedDisputes: number;
  completionRate: number;
}

interface HealthDashboardProps {
  data: HealthData | null;
}

const HealthDashboard: React.FC<HealthDashboardProps> = ({ data }) => {
  if (!data) {
    return <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded shadow-lg">Loading platform health data...</div>;
  }

  // Helper function for formatting currency/large numbers (assuming TVL is in USD/ETH scale)
  const formatLargeNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-3">Platform Health Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TVL Card */}
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-blue-500 transition duration-300 hover:shadow-3xl">
          <p className="text-lg font-semibold text-gray-600 mb-2">Total Value Locked (TVL)</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {formatLargeNumber(data.tvl)}
          </p>
        </div>

        {/* Disputes Card */}
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-amber-500 transition duration-300 hover:shadow-3xl">
          <p className="text-lg font-semibold text-gray-600 mb-2">Total Disputes</p>
          <p className="text-4xl font-bold text-amber-600 mt-2">
            {data.totalDisputes}
          </p>
        </div>

        {/* Completion Rate Card */}
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-green-500 transition duration-300 hover:shadow-3xl">
          <p className="text-lg font-semibold text-gray-600 mb-2">Dispute Completion Rate</p>
          <div className="flex items-center mt-2">
            <span className="text-4xl font-bold text-green-600 mr-4">{data.completionRate}%</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${data.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 p-6 bg-blue-50 border-l-4 border-blue-300 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Platform Summary</h2>
        <p className="text-gray-700">
          Monitoring the operational efficiency and liquidity of the TrustLance ecosystem. This dashboard provides a real-time overview of key financial and dispute metrics derived from on-chain and off-chain data aggregates.
        </p>
      </div>
    </div>
  );
};

export default HealthDashboard;