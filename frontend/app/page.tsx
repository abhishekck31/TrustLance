// Next.js page for the Security Monitoring Dashboard.
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight, AlertTriangle, Zap } from 'lucide-react';

interface SecurityAlert {
  id: number;
  blockchain: string;
  address: string;
  reason: string;
  amount: string; // Displayed as string for formatting large numbers
  timestamp: string;
  is_resolved: boolean;
}

export default function SecurityDashboard() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/alerts');
        setAlerts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data from the backend.');
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg font-medium">Loading security data...</div>;
  if (error) return <div className="p-8 text-red-600 bg-red-50 border border-red-300 rounded-lg mt-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <header className="mb-8 pb-4 border-b border-yellow-500">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500" /> Security Monitoring Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Real-time tracking of suspicious blockchain activity</p>
      </header>

      <div className="space-y-6">
        {alerts.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
            <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
            <p className="text-gray-400">No suspicious alerts found at this time.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`bg-gray-800 p-5 rounded-lg shadow-xl border-l-4 ${alert.is_resolved ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-white truncate">Alert ID: #{alert.id}</h2>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${alert.is_resolved ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                  {alert.is_resolved ? 'Resolved' : 'Active'}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-1">Blockchain: {alert.blockchain}</p>
              <div className="mt-3 space-y-2 text-gray-300 border-t border-gray-700 pt-3">
                <p><strong className="text-yellow-400">Address:</strong> {alert.address}</p>
                <p><strong className="text-yellow-400">Reason:</strong> {alert.reason}</p>
                <p><strong className="text-red-400">Amount:</strong> {alert.amount.toLocaleString()}</p>
                <p><strong className="text-gray-500">Timestamp:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}