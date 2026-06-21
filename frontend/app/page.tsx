// Next.js Frontend page for the Escrow Funnel UI
'use client';

import { useState } from 'react';
import { useConnect, useAccount, useReadContract, useWriteContract } from 'wagmi';
import { href, useArbitraryState } from 'next/link';
import { formatUnits } from 'ethers/lib/utils';

// Assume these are configured in wagmi config
const ESCROW_CONTRACT_ADDRESS = "0x..."; // Placeholder for deployed contract address
const ESCROW_ABI = [...]; // Placeholder for compiled ABI
const TOKEN_ADDRESS = "0x..."; // Address of the token being used (e.g., ETH or USDC)

export default function EscrowFunnel() {
    const { address, isConnected } = useAccount();
    const { data: jobStatus, error: statusError } = useReadContract({
        address: ESCROW_CONTRACT_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'jobs', // This depends heavily on how the contract exposes jobs (mocking for structure)
        args: [/* job ID */]
    });

    const { data: transaction, error: txError, writeContract } = useWriteContract();

    const [jobIdInput, setJobIdInput] = useState('');
    const [amountInput, setAmountInput] = useState('');
    const [executorAddress, setExecutorAddress] = useState('');
    const [status, setStatus] = useState('PENDING_JOB');
    const [loading, setLoading] = useState(false);

    // --- Handlers ---

    const createJob = async () => {
        if (!isConnected) return alert("Connect wallet to proceed.");
        try {
            const tx = await writeContract({
                address: ESCROW_CONTRACT_ADDRESS,
                abi: ESCROW_ABI,
                functionName: 'createJob',
                args: [
                    BigInt(amountInput), 
                    ethers.constants.AddressZero // Placeholder for actual address input
                ],
                value: parseFloat(amountInput) // Sending ETH/Native token
            });
            alert(`Job Created! Tx Hash: ${tx}`);
        } catch (error) {
            console.error("Error creating job:", error);
            alert("Failed to create job.");
        }
    };

    const checkStatus = async (id) => {
        try {
            // In a real app, this reads from the contract state directly or calls a getter function
            const result = await useReadContract({
                address: ESCROW_CONTRACT_ADDRESS,
                abi: ESCROW_ABI,
                functionName: 'jobs', 
                args: [id]
            });
            setStatus(result.state);
        } catch (error) {
            setStatus('ERROR');
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Escrow Conversion Funnel</h1>
            
            {/* Step 1: Create Job */}
            <div className="border p-6 rounded-lg shadow-md mb-8 bg-white">
                <h2 className="text-xl font-semibold mb-4">1. Initiate Job Escrow</h2>
                <p className="mb-3">Fund the contract with your intended job amount and specify the executor.</p>

                <input 
                    type="number" 
                    placeholder="Job Amount (ETH)" 
                    value={amountInput} 
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                />
                <input 
                    type="text" 
                    placeholder="Executor Address" 
                    value={executorAddress} 
                    onChange={(e) => setExecutorAddress(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
                
                <button 
                    onClick={createJob}
                    disabled={!isConnected || !amountInput || !executorAddress}
                    className={`w-full py-3 font-semibold rounded transition ${isConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    Create & Fund Job
                </button>
            </div>

            {/* Step 2 & 3: Tracking Funnel */}
            <div className="border p-6 rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-4">2. Track Escrow Status</h2>
                
                <input 
                    type="text" 
                    placeholder="Enter Job ID to Check Status" 
                    value={jobIdInput} 
                    onChange={(e) => setJobIdInput(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />

                <button 
                    onClick={() => checkStatus(jobIdInput)}
                    disabled={!jobIdInput || loading}
                    className={`w-full py-3 font-semibold rounded transition ${loading ? 'bg-yellow-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Checking...' : 'Check Status'}
                </button>

                {status && (
                    <div className={`mt-4 p-4 rounded-lg font-bold ${status === 'COMPLETED' ? 'bg-green-100 text-green-800' : status === 'FUNDED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        Current Status: {status}
                    </div>
                )}
            </div>
        </div>
    );
}

// Mock dependency needed for compilation safety in this context
const ethers = require('ethers'); 
// In a real setup, wagmi hooks handle much of the Ethers integration.
export { EscrowFunnel };