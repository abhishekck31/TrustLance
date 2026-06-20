// Main page component for displaying the animated voting results.
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useConnect, useAccount, useReadContract, useWaitForDataFetching } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ethers } from 'ethers';
import { ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

// --- Configuration Placeholder ---
// In a real app, these would be loaded from environment variables or configuration files.
const CONTRACT_ADDRESS = "0x..."; // Replace with actual contract address
const ABI = [
    // Mock ABI snippet for the Governance contract functions used above
    { name: "castVote", type: "function", inputs: ["uint256", "uint256"], stateMutability: "nonpayable", type: "function" },
    { name: "getResults", type: "function", inputs: ["uint256"], outputs: ["uint256", "uint256"], stateMutability: "view" },
    // Add other necessary contract methods...
];

export default function GovernanceResults() {
    const { address, isConnected } = useAccount();
    const { data: resultsData, error: readError, isError } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'getResults',
        args: [1], // Fetch results for Vote ID 1
    });
    const { isLoading: loading, isSuccess: isSuccessData, data: voteStatus } = useWaitForDataFetching({
        address: CONTRACT_ADDRESS,
        functionName: 'getResults',
        args: [1]
    });

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [animationState, setAnimationState] = useState({ yes: 0, no: 0 });
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchResults = useCallback(async () => {
        if (!isConnected) return;
        setStatus('loading');
        try {
            // 1. Attempt to fetch via Web3 ReadContract (for standard data sync)
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI);
            const [yes, no] = await contract.getResults(1);

            // 2. If we had real-time listeners (e.g., using window.ethereum event listeners or subscription), this is where the animation hook would trigger.
            setAnimationState({ yes, no });
            setLastUpdate(new Date());
            setStatus('success');

        } catch (err) {
            console.error("Error fetching data:", err);
            setStatus('error');
        }
    }, [isConnected]);


    // Effect to trigger initial fetch and potentially handle chain events in a production environment
    useEffect(() => {
        if (isConnected) {
            fetchResults();
            
            // --- Simulation of Animation/Real-time Update ---
            // In a live scenario, this block would be replaced by a subscription hook 
            // listening for the 'ResultsUpdated' event emitted by the contract.
            const interval = setInterval(() => {
                // Simulate result fluctuation for animation effect
                const newYes = Math.floor(Math.random() * 10) + 45;
                const newNo = 100 - newYes;
                setAnimationState({ yes: newYes, no: newNo });
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [isConnected, fetchResults]);


    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-2" />
                <p className="text-lg text-gray-700">Connect Wallet to view results</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <header className="mb-8 pb-4 border-b border-indigo-200">
                <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center">
                    Governance Results
                </h1>
                <p className="text-gray-600 mt-2">Vote ID: 1 Animation Demo</p>
            </header>

            {status === 'loading' && (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    <p className="ml-3 text-xl text-indigo-600">Calculating results...</p>
                </div>
            )}

            {status === 'error' && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">Error loading results. Check connection and contract address.</span>
                </div>
            )}

            {status === 'success' && (
                <div className="bg-white shadow-xl rounded-xl p-8 max-w-4xl mx-auto border-t-4 border-indigo-500">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-3xl font-bold text-gray-900">Vote Summary</h2>
                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${animationState.yes > animationState.no ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {animationState.yes > 50 ? "Majority Yes" : "Mixed Results"}
                        </span>
                    </div>

                    {/* Animated Result Display */}
                    <div className="flex items-center justify-center h-48 md:h-64 bg-indigo-50 rounded-lg shadow-inner mb-8">
                        {/* Yes Bar (Animated) */}
                        <div 
                            className="w-1/2 p-4 flex flex-col justify-center items-start transition-all duration-1000 ease-in-out bg-green-500 shadow-lg text-white"
                            style={{ width: `${(animationState.yes / 100) * 100}%` }}
                        >
                            <div className="text-xl font-semibold mb-2">YES</div>
                            <div className="text-3xl font-bold">{animationState.yes}%</div>
                        </div>

                        {/* No Bar (Animated) */}
                        <div 
                            className="w-1/2 p-4 flex flex-col justify-center items-start transition-all duration-1000 ease-in-out bg-red-500 shadow-lg text-white"
                            style={{ width: `${(animationState.no / 100) * 100}%` }}
                        >
                            <div className="text-xl font-semibold mb-2">NO</div>
                            <div className="text-3xl font-bold">{animationState.no}%</div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <p className="font-semibold text-gray-700">Current State:</p>
                        <p className="text-lg mt-1">Total Yes: <span className="font-bold text-green-600">{animationState.yes}</span></p>
                        <p className="text-lg">Total No: <span className="font-bold text-red-600">{animationState.no}</span></p>
                    </div>
                    
                     <div className="mt-4 text-sm text-gray-500 text-center">
                        Last Updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'N/A'}
                    </div>
                </div>
            )}
        </div>
    );
}