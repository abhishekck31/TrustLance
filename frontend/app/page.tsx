// Main Next.js page showing the funnel status and actions.
"use client";

import { useState, useEffect } from 'react';
import { API_URL } from '../utils/constants'; // Assume constants file exists
import axios from 'axios';

interface JobData {
    jobId: number;
    status: string;
    description: string;
    amount: string;
}

export default function HomePage() {
    const [jobId, setJobId] = useState<number | null>(null);
    const [jobDetails, setJobDetails] = useState<JobData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchJobStatus = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/jobs/${id}`);
            setJobDetails(response.data);
        } catch (err) {
            setError("Failed to fetch job data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInitiate = async (amount: string, description: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/job/new_initiate`, {
                action: 'INITIATE',
                jobId: Math.floor(Math.random() * 10000), // Mock ID generation for demo purposes if contract fails to return it directly
                amount: amount,
                description: description
            });
            // In a real flow, we'd rely on the contract response or subsequent API calls to get the real ID
            setJobId(response.data.jobId || 1); // Mocking ID for demo navigation
            fetchJobStatus(response.data.jobId || 1);

        } catch (err) {
            setError("Failed to initiate job.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFund = async (id: number) => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/job/${id}/fund`);
            fetchJobStatus(id);
        } catch (err) {
            setError("Failed to fund job.");
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (id: number) => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/job/${id}/complete`);
            fetchJobStatus(id);
        } catch (err) {
            setError("Failed to complete job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-indigo-700 mb-8 border-b pb-2">Escrow Conversion Funnel</h1>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">{error}</div>}

            {jobDetails ? (
                <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job #{jobDetails.jobId} Status</h2>
                    <p className="text-sm text-gray-600 mb-4">Description: {jobDetails.description}</p>
                    <div className={`p-3 rounded-lg font-bold ${
                        jobDetails.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        jobDetails.status === 'FUNDED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                        Current Status: {jobDetails.status}
                    </div>

                    {/* Funnel Actions */}
                    <div className="mt-6 space-y-4">
                        {jobDetails.status === 'PENDING' && (
                            <button
                                onClick={() => handleFund(jobDetails.jobId)}
                                disabled={loading}
                                className="w-full py-3 px-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-150"
                            >
                                Step 2: Fund Job
                            </button>
                        )}

                        {jobDetails.status === 'FUNDED' && (
                            <button
                                onClick={() => handleComplete(jobDetails.jobId)}
                                disabled={loading}
                                className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-150"
                            >
                                Step 3: Complete Job
                            </button>
                        )}

                        {jobDetails.status === 'COMPLETED' && (
                            <p className="text-center text-xl font-bold text-green-600">✅ Job Successfully Converted and Completed!</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Start a New Job</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleInitiate(
                            '1000', // Mock amount for form submission
                            'Example Web3 Setup Job'
                        );
                    }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                            <input
                                type="text"
                                placeholder="Enter job details..."
                                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                                required
                            />
                        </div>
                         <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Funding Amount (Mock)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Enter funding amount..."
                                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 text-lg font-semibold rounded-lg transition duration-150 ${
                                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                        >
                            {loading ? 'Processing...' : 'Initiate Job (Step 1)'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}