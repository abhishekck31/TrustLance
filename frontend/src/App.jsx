import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RainbowKit } from 'rainbowkit';

function App() {
    const [jurorIdInput, setJurorIdInput] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch status from backend
    const { data: statusData, isLoading, error } = useQuery({
        queryKey: ['payoutStatus', jurorIdInput],
        queryFn: () => axios.get(`http://localhost:3000/api/payout/status/${jurorIdInput}`)
    });

    const handleDistributePayout = async () => {
        if (!jurorIdInput) return;

        try {
            const response = await axios.post(
                `http://localhost:3000/api/payout/distribute/${jurorIdInput}`,
                { amountToDistribute: 1000 } // Example reward amount
            );
            setStatus({ message: 'Payout initiated successfully.', status: response.data.status });
        } catch (err) {
            setStatus({ message: `Error during payout initiation: ${err.response?.data?.error || err.message}`, status: 'FAILED' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-indigo-600">TrustLance Reward Automation</h1>
                <p className="text-lg text-gray-600 mt-2">Juror Reward Distribution System</p>
            </header>

            <div className="max-w-3xl mx-auto bg-white p-6 shadow-xl rounded-lg border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Juror Status & Payout Automation</h2>

                {/* Juror Status Display */}
                <div className="mb-6 p-4 border rounded-md bg-blue-50">
                    <h3 className="text-xl font-medium mb-2 text-indigo-700">Juror Check</h3>
                    <p className="text-gray-700">ID: {statusData?.jurorId || 'N/A'}</p>
                    <p className="text-gray-700">Awarded Amount (On-Chain Mock): {statusData?.awardedAmount ?? 'N/A'}</p>
                    <p className={`mt-2 font-bold ${statusData?.hasClaimed ? 'text-green-600' : 'text-red-600'}`}>
                        Status: {statusData?.hasClaimed ? 'Claimed' : 'Pending'}
                    </p>
                </div>

                {/* Payout Automation Form */}
                <div className="mt-8 p-5 border-t">
                    <h3 className="text-xl font-medium mb-4 text-gray-800">Trigger Automated Payout</h3>
                    <p className="text-sm text-gray-600 mb-4">Initiate the process to trigger backend automation for a specific juror ID.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="jurorId" className="block text-sm font-medium text-gray-700 mb-1">Juror ID</label>
                            <input
                                id="jurorId"
                                type="number"
                                value={jurorIdInput}
                                onChange={(e) => setJurorIdInput(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Reward Amount (ETH/Token)</label>
                            <input
                                id="amount"
                                type="number"
                                value="1000"
                                onChange={(e) => setJurorIdInput(e.target.value)} // Note: Reusing input state for simplicity
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleDistributePayout}
                        disabled={loading || !jurorIdInput}
                        className={`mt-6 w-full py-3 px-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white transition duration-150 ease-in-out ${
                            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                    >
                        {loading ? 'Automating... Please Wait' : 'Trigger Reward Distribution'}
                    </button>

                    {status && (
                        <div className={`mt-4 p-3 border rounded-md ${status.status === 'FAILED' ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400'}`}>
                            <p className="font-semibold">Result:</p>
                            <p>{status.message}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RainbowKit integration placeholder */}
            <RainbowKitProvider>
                {/* Content would typically be rendered here with wallet connections */}
            </RainbowKitProvider>
        </div>
    );
}

export default App;