// Next.js Frontend component for the AI Escrow Assistant interface.
import React, { useState } from 'react';
import axios from 'axios';

export default function AiEscrowAssistant() {
    const [contractAddress, setContractAddress] = useState('');
    const [status, setStatus] = useState(null);
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:3000/api/contract-status/';

    const fetchStatus = async () => {
        if (!contractAddress) {
            setError("Please enter a contract address.");
            return;
        }
        setLoading(true);
        setStatus(null);
        setExplanation('');
        setError(null);

        try {
            const response = await axios.get(`${API_URL}${contractAddress}`);
            setStatus(response.data.status);
            setExplanation(response.data.explanation);
        } catch (err) {
            console.error("API Error:", err);
            setError("Error fetching data. Check if the address is valid and the backend server is running.");
            setStatus(null);
            setExplanation('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-indigo-700">AI Escrow Assistant</h1>
                <p className="text-lg text-gray-600 mt-2">Explain Contract Status Instantly</p>
            </header>

            <div className="max-w-3xl mx-auto bg-white p-8 shadow-xl rounded-lg border border-indigo-100">
                <div className="mb-6 space-y-4">
                    <label htmlFor="address" className="block text-lg font-medium text-gray-700">Contract Address:</label>
                    <input
                        id="address"
                        type="text"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter Ethereum Contract Address (e.g., 0x...)"
                    />
                    <button
                        onClick={fetchStatus}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-150 ${
                            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                        }`}
                    >
                        {loading ? 'Analyzing Status...' : 'Get Contract Explanation'}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
                        Error: {error}
                    </div>
                )}

                {status && (
                    <div className="mt-8 p-6 bg-indigo-50 border-l-4 border-indigo-500 shadow-md rounded-lg">
                        <h2 className="text-2xl font-bold text-indigo-800 mb-3">Status Overview</h2>
                        <p className="text-gray-700 mb-4">Current State: <span className="font-semibold text-indigo-600">{status}</span></p>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">AI Explanation:</h3>
                        <div className="whitespace-pre-wrap text-gray-600 leading-relaxed border-t pt-3">
                            {explanation}
                        </div>
                    </div>
                )}

                {!loading && !status && !error && (
                     <div className="text-center p-8 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                        Enter an address above and click to get the contract explanation.
                    </div>
                )}
            </div>
        </div>
    );
}