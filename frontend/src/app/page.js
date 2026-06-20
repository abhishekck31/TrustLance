// Main dashboard page implementation using Next.js App Router.
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUp, TrendingUp, DollarSign, Package, Zap } from 'lucide-react';

// Define the structure for a single dashboard card
interface DashboardCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

// --- Components ---

const StatCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-2xl border-l-4 ${color} flex items-center justify-between`}>
        <div>
            <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">${value}</h2>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
            {icon}
        </div>
    </div>
);

const TrendCard: React.FC<{ metric: string, value: string }> = ({ metric, value }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{metric}</h3>
            <TrendingUp className={`w-6 h-6 text-${value.startsWith('+') ? 'green' : 'red'}`} />
        </div>
        <p className="mt-2 text-4xl font-extrabold text-gray-900">
            {value}
        </p>
    </div>
);

// --- Main Page Component ---

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Assuming backend is running on http://localhost:3001
                const response = await axios.get('http://localhost:3001/api/dashboard-analytics');
                setData(response.data);
            } catch (err) {
                console.error("Error fetching analytics:", err);
                setError("Failed to load dashboard data. Is the backend running?");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl">Loading TrustLance Analytics...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center bg-red-50 text-xl text-red-700 p-8">{error}</div>;
    }

    const { totalVolume, holdings, recentTransactions, marketTrends } = data || {};

    return (
        <div className="min-h-screen bg-gray-50 p-8 sm:p-12">
            <header className="mb-10 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                    Bento-Grid Analytics 📊
                </h1>
                <p className="text-lg text-gray-600 mt-2">Real-time Web3 Portfolio Overview</p>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Row 1: Key Metrics (Large Cards) */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatCard
                        title="Total Portfolio Volume"
                        value={totalVolume.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                        icon={<DollarSign className="w-6 h-6" />}
                        color="indigo"
                    />
                    <StatCard
                        title="Total Holdings Value"
                        value={holdings.reduce((sum, item) => sum + item.value, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                        icon={<Package className="w-6 h-6" />}
                        color="teal"
                    />
                </div>

                {/* Row 2: Trends and Activity (Medium Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <TrendCard metric="Volume Change (7d)" value={marketTrends[0]?.value || 'N/A'} />
                    <TrendCard metric="Floor Price Trend" value={marketTrends[1]?.value || 'N/A'} />
                </div>

                {/* Row 3: Recent Activity (Full Width Card) */}
                <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-2xl border-t-4 border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Recent Transactions</h3>
                    <div className="space-y-4">
                        {recentTransactions.map((tx, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                                <div>
                                    <p className="font-medium text-gray-700">{tx.type}</p>
                                    <p className="text-sm text-gray-500">Transaction ID: #{tx.id}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${tx.type === 'Sale' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}