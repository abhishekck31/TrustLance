'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight, AlertTriangle, Clock } from 'lucide-react';

// Define the type for the data we expect from the backend
interface SuspiciousActivity {
  id: number;
  userAddress: string;
  amount: string; // Received as string from API, treat as BigInt conceptually
  reason: string;
  timestamp: string;
  isReported: boolean;
}

export default function SecurityDashboard() {
  const [activities, setActivities] = useState<SuspiciousActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/suspicious-activities');
      setActivities(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load security data from the backend.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-10 border-b pb-4 border-indigo-200">
        <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center">
          <AlertTriangle className="w-8 h-8 mr-3 text-red-600" /> TrustLance Security Monitor
        </h1>
        <p className="text-gray-600 mt-2">Real-time tracking of suspicious on-chain activities</p>
      </header>

      <div className="bg-white shadow-2xl rounded-xl p-6 md:p-10">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-indigo-500">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M12 0C6.477 0 0 6.477 0 12s6.477 12 12 12 12-6.477 12-12S17.523 0 12 0z"></path>
            </svg>
            Loading Suspicious Data...
          </div>
        ) : error ? (
          <div className="text-red-600 font-medium">Error: {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (ETH)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No suspicious activities found</td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-red-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(activity.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{activity.userAddress}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{activity.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md overflow-hidden truncate">
                        {activity.reason}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}