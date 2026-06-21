// Next.js page component for the Premium Analytics Dashboard
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface KPIData {
    totalValue: number;
    dailyChange: number;
    totalTransactions: number;
}

interface AreaDataPoint {
    date: string;
    value: number;
}

interface AnalyticsData {
    kpis: KPIData;
    areaChartData: AreaDataPoint[];
}

// Mock data fetching function
async function fetchAnalyticsData(): Promise<AnalyticsData> {
    // In a real application, this would fetch from the backend API: /api/analytics
    const response = await fetch('http://localhost:3000/api/analytics');
    if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
    }
    const data = await response.json();
    return data;
}

export default async function DashboardPage() {
    try {
        const data = await fetchAnalyticsData();
        const kpis = data.kpis;
        const areaData = data.areaChartData;

        return (
            <div className="p-8 bg-gray-50 min-h-screen">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 border-b pb-4">Premium Analytics Dashboard</h1>

                {/* KPI Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Total Value Card */}
                    <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-indigo-600">
                        <p className="text-sm font-medium text-gray-500">Total Portfolio Value</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">${kpis.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        <p className={`text-sm mt-2 ${kpis.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Daily Change: {kpis.dailyChange > 0 ? '+' : ''}{kpis.dailyChange}%
                        </p>
                    </div>

                    {/* Total Transactions Card */}
                    <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-teal-600">
                        <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{kpis.totalTransactions.toLocaleString()}</p>
                        <p className="text-sm mt-2 text-gray-600">Over the period</p>
                    </div>

                    {/* Performance Card (Placeholder for a third KPI) */}
                     <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-amber-600">
                        <p className="text-sm font-medium text-gray-500">Avg. Daily Return</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{kpis.dailyChange}%</p>
                        <p className="text-sm mt-2 text-gray-600">Recent performance metric</p>
                    </div>
                </div>

                {/* Area Chart Section */}
                <div className="bg-white p-6 rounded-lg shadow-xl">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Value Trend Over Time</h2>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={areaData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`} />
                                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={0.7} strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        return <div className="p-8 text-center text-red-600">Error loading dashboard: {error instanceof Error ? error.message : 'An unknown error occurred'}. Ensure the backend server is running.</div>;
    }
}