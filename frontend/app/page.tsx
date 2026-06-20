// Next.js Frontend component to display reputation scores
'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

export default function ReputationDashboard() {
    const { address, isConnected } = useAccount();
    const [reputation, setReputation] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isConnected) {
            setLoading(false);
            return;
        }

        if (address) {
            // IMPORTANT: Replace this with the actual contract address and ABI in a real setup.
            const contractAddress = "0xYourReputationContractAddressHere"; 
            
            const { data, error } = useReadContract({
                address: contractAddress,
                abi: [
                    "function getReputation(address) view returns (uint256)",
                    // Include other functions if needed
                ],
                args: [address],
            });

            if (error) {
                setError("Error fetching reputation data.");
                setLoading(false);
                return;
            }
            
            if (data) {
                setReputation(data as number);
            } else {
                setError("No reputation data found.");
            }
        }
        setLoading(false);
    }, [isConnected, address]);

    if (loading) {
        return <div className="p-8 text-center text-xl">Loading Reputation Data...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-lg mt-10 border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Reputation Dashboard</h1>
            
            {!isConnected ? (
                <p className="text-lg text-gray-500 mb-4">Connect your wallet to view reputation.</p>
            ) : (
                <>
                    <div className="mb-6 p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg">
                        <p className="text-xl font-semibold text-gray-700">Your Reputation Score:</p>
                        <p className="text-5xl font-extrabold text-indigo-600 mt-2">{reputation ? reputation.toLocaleString() : 'N/A'}</p>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3 text-gray-700">Decay Details</h2>
                        <p className="text-sm text-gray-600">This score is calculated based on on-chain interactions and the applied decay model.</p>
                    </div>
                </>
            )}
        </div>
    );
}