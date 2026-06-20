// Next.js Frontend component for the DAO Treasury Dashboard.
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, BarChart3 } from 'lucide-react';

interface Holding {
    address: string;
    balance: string;
}

interface Flow {
    from: string;
    to: string;
    amount: string;
    description: string;
}

interface TreasuryData {
    owner: string;
    holdings: Record<string, string>; // Address -> Balance
    flows: Flow[];
}

export default function DaoTreasuryDashboard() {
    const [data, setData] = useState<TreasuryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the mock backend API
                const response = await axios.get('http://localhost:3001/api/dashboard/treasury');
                setData(response.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Could not load treasury data. Is the backend running?");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-50">Loading Treasury Dashboard...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600 bg-white shadow rounded-lg mt-10">{error}</div>;
    }

    if (!data) {
        return <div className="p-8 text-center">No data available for the DAO Treasury.</div>;
    }

    const holdingsArray = Object.entries(data.holdings).map(([address, balance]) => ({ address, balance: parseInt(balance, 10) }));
    
    // Sort holdings by balance descending for better visualization
    const sortedHoldings = holdingsArray.sort((a, b) => b.balance - a.balance);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-10 border-b pb-4 flex justify-between items-center">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                    <DollarSign className="w-8 h-8 mr-3 text-indigo-600" /> DAO Treasury Dashboard
                </h1>
                <p className='text-sm text-gray-500'>Data reflects on-chain holdings and recent flows</p>
            </header>

            {/* Section 1: Total Holdings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center"><BarChart3 className='w-5 h-5 mr-2'/> Total Value (Mock)</h2>
                    <p className="text-4xl font-bold text-indigo-600">${(data.holdings["0xDAO_Vault"] || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center"><ArrowUpCircle className='w-5 h-5 mr-2'/> Total Accounts</h2>
                    <p className="text-4xl font-bold text-green-600">{sortedHoldings.length}</p>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center"><ArrowDownCircle className='w-5 h-5 mr-2'/> Total Flows</h2>
                    <p className="text-4xl font-bold text-yellow-600">{data.flows.length}</p>
                </div>
            </div>

            {/* Section 2: Treasury Holdings */}
            <section className="bg-white p-8 rounded-xl shadow-2xl mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3 flex items-center"><DollarSign className='w-6 h-6 mr-2'/> Treasury Holdings</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Account</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance (Mock Tokens)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedHoldings.map((item) => (
                                <tr key={item.address} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-800">{item.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-semibold">{item.balance.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Section 3: Treasury Flows */}
            <section className="bg-white p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3 flex items-center"><ArrowUpCircle className='w-6 h-6 mr-2'/> Treasury Flows</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.flows.map((flow, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{flow.from}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{flow.to}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-700">{flow.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{flow.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}