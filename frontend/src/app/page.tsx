'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface MonthlyData {
  month: string;
  mrr: number;
  metrics: {
    totalMRR: number;
    newSubscriptions: number;
    churnedCustomers: number;
  };
}

export default function RevenueDashboard() {
  const [data, setData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example: Fetch data for the current month (assuming we fetch data for a specific date input)
  const fetchDashboardData = async (year: number, month: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/api/analytics/monthly/${year}/${month}`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching monthly data:", err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load: Fetch for the current month
  useEffect(() => {
    const now = new Date();
    fetchDashboardData(now.getFullYear(), now.getMonth() + 1);
  }, []);


  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedMonth = parseInt(e.target.value);
      if (!isNaN(selectedMonth)) {
          // Assuming we want to see data for the current year
          fetchDashboardData(now.getFullYear(), selectedMonth);
      }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Revenue Analytics Dashboard</h1>

      <div className="mb-8 p-4 bg-white shadow rounded-lg max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Monthly MRR Overview</h2>
        <div className="flex space-x-4 items-center">
            <label htmlFor="monthSelect" className="font-medium">Select Month:</label>
            <select id="monthSelect" onChange={handleMonthChange} className="border p-2 rounded focus:ring-indigo-500 focus:border-indigo-500">
                {/* Simplified month options for demonstration */}
                {(1..12).map(m => (
                    <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                ))}
            </select>
            <button 
                onClick={() => fetchDashboardData(new Date().getFullYear(), new Date().getMonth() + 1)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
                Refresh Current Month
            </button>
        </div>

        {loading && <p className="mt-4 text-indigo-500">Loading...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {data && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded shadow-md border-l-4 border-blue-500">
                <p className="text-sm font-medium text-gray-600">Total MRR</p>
                <p className="text-2xl font-bold text-blue-800">${data.mrr.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-4 rounded shadow-md border-l-4 border-green-500">
                <p className="text-sm font-medium text-gray-600">New Subs (Month)</p>
                <p className="text-2xl font-bold text-green-800">{data.metrics.newSubscriptions}</p>
              </div>
              <div className="bg-red-100 p-4 rounded shadow-md border-l-4 border-red-500">
                <p className="text-sm font-medium text-gray-600">Churned Customers</p>
                <p className="text-2xl font-bold text-red-800">{data.metrics.churnedCustomers}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}