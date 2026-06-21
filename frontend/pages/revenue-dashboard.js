import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueDashboard = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch data from the backend analytics endpoint
        const response = await axios.get('/api/analytics/mrr-analytics?months=12');
        setAnalytics(response.data.data);
      } catch (err) {
        setError('Failed to fetch revenue data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div>Loading Revenue Analytics...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">MRR Revenue Analytics</h1>
      <p className="mb-4 text-lg text-gray-600">Monthly Recurring Revenue (MRR) Trend</p>

      {analytics.length === 0 ? (
        <p className="text-gray-500">No revenue data available to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={analytics}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthYear" />
            <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'MRR']} />
            <Legend />
            <Bar dataKey="totalMRR" fill="#3b82f6" name="Monthly Recurring Revenue (MRR)" />
          </BarChart>
        </ResponsiveContainer>
      )}

    </div>
  );
};

export default RevenueDashboard;