'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

interface CohortData {
  cohortMonth: string;
  cohortSize: number;
  retainedCount: number;
}

export default function CohortDashboard() {
  const [data, setData] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCohortData = async () => {
      try {
        // Assuming the backend runs on localhost:3000
        const response = await fetch('http://localhost:3000/analytics/cohort-retention');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error("Failed to fetch cohort data:", err);
        setError("Could not load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCohortData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
        <p className="text-lg text-gray-600">Calculating Monthly Cohorts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <AlertTriangle className="h-6 w-6 mb-2" />
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white shadow-xl rounded-xl max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">
        Retention Cohort Analytics
      </h1>
      <p className="mb-6 text-gray-600">Tracking user retention based on their onboarding month.</p>

      {data.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-indigo-50">
          No cohort data found yet. Start transacting to generate analytics!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cohort Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cohort Size (N)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retained Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retention Rate (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row) => (
                <tr key={row.cohortMonth} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.cohortMonth}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.cohortSize}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{row.retainedCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-bold">
                    {((row.retainedCount / row.cohortSize) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}