import { fetchData } from '@/lib/api'; // Assume an API utility function exists
import { Loader2, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

interface HealthMetrics {
  tvl: number;
  disputes: number;
  completionRate: number;
}

export default async function PlatformHealthDashboard() {
  // Simulate fetching data from the backend API
  const data = await fetchData('/api/health');

  if (!data) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>Could not load platform health data.</p>
      </div>
    );
  }

  const { tvl, disputes, completionRate } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mb-8 pb-6 border-b">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
          Platform Health Dashboard
          <TrendingUp className="ml-3 w-8 h-8 text-indigo-500" />
        </h1>
        <p className="text-lg text-gray-600 mt-2">Real-time operational metrics for TrustLance</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* TVL Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 transition duration-300 hover:shadow-xl">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total TVL</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-4xl font-bold text-gray-900">${tvl.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</span>
            <span className="text-sm text-green-600">+1.2% WoW (Mock)</span>
          </div>
        </div>

        {/* Disputes Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 transition duration-300 hover:shadow-xl">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Disputes</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-4xl font-bold text-gray-900">{disputes}</span>
            <span className="text-sm text-yellow-600">Monitor Closely</span>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 transition duration-300 hover:shadow-xl">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Completion Rate</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-4xl font-bold text-gray-900">{Math.round(completionRate * 100)}%</span>
            <span className={`text-sm ${completionRate > 0.7 ? 'text-green-600' : 'text-orange-600'}`}>Performance Index</span>
          </div>
        </div>
      </div>

      {/* Detailed Visualization */}
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Metrics Overview</h2>
        
        <div className="space-y-6">
            {/* TVL Visualization */}
            <div>
                <h3 className="font-bold text-lg text-indigo-700 mb-3 flex items-center"><BarChart3 className="w-5 h-5 mr-2"/> Total Value Locked (TVL)</h3>
                <div className="bg-gray-100 rounded-full h-6">
                    <div 
                        className="h-6 rounded-full bg-indigo-500 transition-all duration-500" 
                        style={{ width: `${Math.min(tvl / 300000000, 100)}%` }} // Mock scaling for visualization
                    ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Current TVL benchmark is being tracked.</p>
            </div>

            {/* Disputes Visualization */}
             <div>
                <h3 className="font-bold text-lg text-red-700 mb-3 flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/> Dispute Load</h3>
                <div className="bg-gray-100 rounded-full h-6">
                    <div 
                        className="h-6 rounded-full bg-red-400 transition-all duration-500" 
                        style={{ width: `${Math.min(disputes / 100, 100)}%` }} // Mock scaling for visualization
                    ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">The current dispute volume is manageable.</p>
            </div>

            {/* Completion Rate Visualization */}
             <div>
                <h3 className="font-bold text-lg text-green-700 mb-3 flex items-center"><TrendingUp className="w-5 h-5 mr-2"/> Process Completion Rate</h3>
                <div className="bg-gray-100 rounded-full h-6">
                    <div 
                        className="h-6 rounded-full bg-green-500 transition-all duration-500" 
                        style={{ width: `${completionRate * 100}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Target completion rate is ${Math.round(completionRate * 100)}%.</p>
            </div>
        </div>

      </div>
    </div>
  );
}

// Mock API utility (for demonstration purposes, assumes this exists in lib/api)
function fetchData(url: string): Promise<HealthMetrics | null> {
    // In a real setup, use fetch() to call the backend endpoint.
    // For this autonomous example, we simulate the successful response data structure.
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData: HealthMetrics = {
                tvl: 150_000_000.75,
                disputes: 42,
                completionRate: 0.65
            };
            resolve(mockData);
        }, 300);
    });
}