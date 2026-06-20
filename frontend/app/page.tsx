'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Holding {
  address: string;
  tokenSymbol: string;
  balance: string; // Displayed as string/text for large numbers
}

interface Flow {
  fromAddress: string;
  toAddress: string;
  token: string;
  amount: string; // Displayed as string/text for large numbers
  timestamp: string;
}

export default function TreasuryDashboard() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const API_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Holdings
        const holdingsRes = await axios.get(`${API_URL}/treasury/holdings`);
        setHoldings(holdingsRes.data);

        // Fetch Flows
        const flowsRes = await axios.get(`${API_URL}/treasury/flows`);
        setFlows(flowsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xl mt-10">Loading DAO Treasury Data...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600 text-center mt-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mb-8 pb-4 border-b">
        <h1 className="text-4xl font-extrabold text-gray-900">DAO Treasury Dashboard</h1>
        <p className="text-gray-600 mt-2">Real-time Holdings and Transaction Flows</p>
      </header>

      {/* Holdings Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">Treasury Holdings</h2>
        {holdings.length === 0 ? (
          <p className="text-gray-500 italic">No treasury holdings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {holdings.map((holding) => (
                  <tr key={holding.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{holding.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.tokenSymbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-600">
                      {/* Formatting large BigInt balance */}
                      {holding.balance.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Flows Section */}
      <section className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">Treasury Flows (Transactions)</h2>
        {flows.length === 0 ? (
          <p className="text-gray-500 italic">No treasury flows recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flows.map((flow) => (
                  <tr key={flow.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{format(new Date(flow.timestamp), 'yyyy-MM-dd HH:mm')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flow.fromAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{flow.toAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flow.token}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-red-600">
                      {/* Formatting large BigInt amount */}
                      {flow.amount.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}