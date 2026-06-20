// Next.js Frontend component (Wagmi/RainbowKit integration placeholder)
import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { createConfig, publicClient, mainnet } from 'wagmi/core';
import { mainnetWallet } from 'wagmi/connectors';
import { RainbowKitcolor } from '@rainbow-me/rainbowkit';

// Placeholder for contract addresses and ABI (must be loaded via environment variables in production)
const TREASURY_ADDRESS = "0x..."; // Replace with deployed Treasury address
const VOTING_CONTRACT_ADDRESS = "0x..."; // Replace with deployed Voting contract address

export default function TreasuryAllocationApp() {
    const { address, isConnected } = useAccount();
    const { data: allocationsData, error: allocError } = useReadContract({
        address: TREASURY_ADDRESS,
        abi: [ /* Paste ABI for Treasury here */ ],
        function: "getAllAllocations",
    });

    const [pendingVoteId, setPendingVoteId] = useState<string | null>(null);
    const [vote, setVote] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const handleVote = async () => {
        if (!isConnected) return;
        setLoading(true);
        try {
            // This uses useWriteContract to sign and send the transaction
            await useWriteContract({
                address: VOTING_CONTRACT_ADDRESS,
                abi: [ /* Paste ABI for Voting contract here */ ],
                function: "voteOnAllocation",
                args: [pendingVoteId, vote],
            });
            alert(`Vote successfully cast for ID ${pendingVoteId}!`);
        } catch (e) {
            console.error("Voting failed:", e);
            alert("Error casting vote.");
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) {
        return <div>Connect Wallet to view allocations and vote.</div>;
    }

    return (
        <div className="p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Treasury Allocation Voting</h1>

            <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-3">Cast Vote</h2>
                {pendingVoteId ? (
                    <div>
                        <p>Voting for Allocation ID: <span className="font-bold">{pendingVoteId}</span></p>
                        <div className="mt-3 flex items-center space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="vote"
                                    value="true"
                                    checked={vote}
                                    onChange={(e) => setVote(e.target.value === 'true')}
                                />
                                <span>Approve</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="vote"
                                    value="false"
                                    checked={!vote}
                                    onChange={(e) => setVote(e.target.value === 'false')}
                                />
                                <span>Reject</span>
                            </label>
                        </div>
                        <button
                            onClick={handleVote}
                            disabled={loading}
                            className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : `Submit Vote for ${pendingVoteId}`}
                        </button>
                    </div>
                ) : (
                    <p className="text-red-500">Please select an allocation to vote on.</p>
                )}
            </div>

            <div className="mt-8 p-4 border rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-3">Current Allocations</h2>
                {allocError ? <p className="text-red-500">Error loading allocations.</p> : (
                    <div>
                        {allocationsData?.data?.map((alloc) => (
                            <div key={alloc.id} className="p-3 border-b flex justify-between items-center">
                                <div>
                                    <p>ID: {alloc.id}</p>
                                    <p>Recipient: {alloc.recipient}</p>
                                    <p>Amount Allocated: {formatEther(alloc.amount)}</p>
                                    <p>Votes: {alloc.voteCount}</p>
                                    {alloc.isAllocated && <span className="text-green-600 font-bold">Status: Finalized</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Utility function (needs to be implemented or imported)
function formatEther(value) {
    if (!value) return "0";
    return value.toString().substring(0, 6) + "..."; // Mock formatting
}