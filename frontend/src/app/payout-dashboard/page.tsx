// Next.js Frontend Dashboard for monitoring payouts
import { useState, useEffect } from 'react';
import axios from 'axios';

interface JurorPayout {
  id: number;
  jurorId: string;
  status: string;
  rewardAmount: string;
  payoutWalletAddress: string;
}

export default function PayoutDashboard() {
  const [payouts, setPayouts] = useState<JurorPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        // Fetch data from the backend API endpoint
        const response = await axios.get('/api/payouts'); 
        setPayouts(response.data);
      } catch (err) {
        setError("Failed to fetch payout data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  if (loading) return <div>Loading Payout Dashboard...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Juror Reward Distribution Dashboard</h1>
      
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juror ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juror Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout Wallet</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payouts.map((payout) => (
              <tr key={payout.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payout.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.jurorId}</td> {/* Placeholder: Real implementation requires fetching address from DB */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.rewardAmount.toLocaleString()}</td>
                <td className={`px-6 py-4 whitespace-nowrap font-semibold ${
                  payout.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {payout.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payout.payoutWalletAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}