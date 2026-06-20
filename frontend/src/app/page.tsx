// Main page component for the dashboard

'use client';

import { useState, useEffect } from 'react';
import HealthDashboard from '@/components/HealthDashboard';

export default function DashboardPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        // Fetch data from the backend API
        const response = await fetch('http://localhost:3000/api/health');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHealthData(data);
      } catch (err) {
        console.error('Failed to fetch health data:', err);
        setError('Could not load dashboard data from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-50">Loading Health Metrics...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-red-100 text-red-700">Error: {error}</div>;
  }

  return (
    <main>
      {healthData ? (
        <HealthDashboard data={healthData} />
      ) : (
        <div className="flex justify-center items-center h-screen bg-red-100 text-red-700">No health data available.</div>
      )}
    </main>
  );
}