// Next.js Frontend component for viewing and voting on allocations.
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Head from 'next/head';

const API_URL = 'http://localhost:3001/api'; // Backend endpoint

export default function TreasuryAllocationVoting() {
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [voteId, setVoteId] = useState('');
    const [voteStatus, setVoteStatus] = useState(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchAllocations = async () => {
            try {
                const response = await axios.get(`${API_URL}/allocation/1`); // Example fetching allocation ID 1
                if (response.data.success) {
                    setAllocations([response.data.data]);
                } else {
                     setError("Could not fetch data from backend.");
                }
            } catch (err) {
                console.error("Frontend Fetch Error:", err);
                setError("Failed to connect to the backend service or retrieve allocation data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllocations();
    }, []);

    // --- Voting Functionality ---
    const handleVote = async () => {
        if (!voteId) {
            setError("Please enter an Allocation ID to vote on.");
            return;
        }

        setVoteStatus("Submitting vote...");

        try {
            const response = await axios.post(`${API_URL}/vote`, {
                allocationId: voteId,
                voteFor: true // True for voting FOR the allocation
            });
            setVoteStatus(`Success! ${response.data.message}`);
            console.log(response.data);
        } catch (err) {
            setError("Voting failed. Check console for details.");
            console.error("Voting Error:", err.response ? err.response.data : err.message);
        }
    };

    if (loading) return <div>Loading Treasury Data...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
            <Head>
                <title>TrustLance Treasury Voting</title>
            </Head>
            <h1 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-2">Governance Treasury Allocation</h1>

            <div className="bg-white shadow p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">Vote on Allocation (Example ID: 1)</h2>
                {allocations.length > 0 ? (
                    <div>
                        <p className="mb-3">Allocation Details (ID: {allocations[0].id}):</p>
                        <p>Recipient: {allocations[0].recipient}</p>
                        <p>Amount: {ethers.utils.formatUnits(allocations[0].amount, 18)}</p>
                        <p>Voting Deadline (Timestamp): {new Date(allocations[0].votingDeadline * 1000).toLocaleString()}</p>
                        <p>Current Votes For: {allocations[0].votesFor}</p>
                        <p>Current Votes Against: {allocations[0].votesAgainst}</p>
                        <p className={`mt-4 p-3 rounded ${allocations[0].isAllocated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            Status: {allocations[0].isAllocated ? "Finalized" : "Voting Open"}
                        </p>

                        {/* Voting Interface */}
                        <div className="mt-6">
                            <label htmlFor="voteId" className="block text-lg font-medium mb-2">Allocation ID to Vote For:</label>
                            <input
                                id="voteId"
                                type="number"
                                className="w-full md:w-1/2 p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter Allocation ID"
                            />
                            <button
                                onClick={() => setVoteId(document.getElementById('voteId').value)}
                                className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                            >
                                Select & Proceed to Vote
                            </button>

                            {voteStatus && (
                                <div className={`mt-4 p-3 border ${voteStatus.startsWith('Success') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                                    {voteStatus}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>No allocations found to display.</p>
                )}
            </div>

        </div>
    );
}