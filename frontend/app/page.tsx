// This file will serve as the main container demonstrating the micro-interactions.
import { useState } from 'react';
import { WalletCard } from '@/components/WalletCard';
import { CopyFeedbackToast } from '@/components/CopyFeedbackToast';

export default function Dashboard() {
  const [copyState, setCopyState] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyState(true);
      setTimeout(() => setCopyState(false), 2000); // Show feedback for 2 seconds
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">TrustLance Dashboard</h1>
      
      {/* Card Hover Elevation Example */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <WalletCard title="Total Assets" value="$1,234,567.89" status="Active" />
        <WalletCard title="Pending Transactions" value="3" status="Warning" />
        <WalletCard title="Contract Balance" value="0.00 ETH" status="Success" />
      </div>

      {/* Status Badge Animation Example */}
      <div className="bg-white p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-2xl border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Activity</h2>
        
        {/* Status Badge Animation */}
        <div className="flex items-center justify-between p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg transition duration-500 hover:bg-blue-100">
          <span className="text-sm font-medium text-gray-600">Transaction 0xABC...</span>
          <span className={`px-3 py-1 text-xs font-bold rounded-full transition duration-300 ${
            "bg-green-200 text-green-800"
          }`}>Success</span>
        </div>

        {/* Copy Feedback Example */}
        <div className="mt-6 pt-4 border-t">
            <h3 className="font-semibold mb-2">Contract Address:</h3>
            <p className="text-sm text-gray-600 break-all mb-3">{`0xAbc123...${'a'.repeat(32)}`}</p>
            <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
                onClick={() => handleCopy(`0xAbc123...${'a'.repeat(32)}`)}
            >
                Copy Address
            </button>
            <CopyFeedbackToast isVisible={copyState} />
        </div>
      </div>
    </div>
  );
}