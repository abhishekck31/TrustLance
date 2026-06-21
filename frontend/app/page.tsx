// Frontend component to interact with the NFT and display proof details
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { injectProvider } from 'wagmi/middleware';
import { publicProvider } from 'wagmi/providers/public';
import { ethers } from 'ethers';

// Note: In a full setup, contract addresses and ABI would be loaded dynamically.
const NFT_CONTRACT_ADDRESS = "0x..."; // Placeholder
const NFT_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function tokenIds() view returns (uint256[])",
    "function projectProofs(uint256) view returns (uint256, uint256, string)",
];

export default function ProofOfWorkNFTPage() {
    const { address, isConnected } = useAccount();
    const [mintDetails, setMintDetails] = useState('');
    const [nftAddress, setNftAddress] = useState<string>('');
    const [proofData, setProofData] = useState<{ hash: string; timestamp: number; details: string } | null>(null);
    const [loading, setLoading] = useState(false);

    // --- Web3 Read Operations ---
    const { data: tokenIds, error: tokenError } = useReadContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        function: "tokenIds",
    });

    const fetchProof = async (tokenId: number) => {
        try {
            const contract = new ethers.JsonRpcProvider(window.ethereum);
            const proofTuple = await contract.call({
                to: NFT_CONTRACT_ADDRESS,
                data: `getProof(${tokenId})`,
                type: 'function',
                inputs: [tokenId]
            });

            // Expects tuple return from Solidity (hash, timestamp, details)
            const result = proofTuple.result;
            setProofData({
                hash: result.proofHash.toString(),
                timestamp: Number(result.timestamp),
                details: result.details,
            });
        } catch (e) {
            console.error("Error fetching proof:", e);
            setProofData(null);
        }
    };

    const handleMint = async () => {
        if (!isConnected || !window.ethereum) {
            alert("Please connect your wallet.");
            return;
        }

        try {
            // Simulate the external PoW calculation resulting in a hash string for the contract call
            const mockProofHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MockPoW_Data_For_" + Date.now()));

            // Call the contract to mint
            const tx = await window.ethereum.request({
                method: `mintProofOfWorkNFT(${String(1)}, ${mockProofHash}, "Project Alpha - Completed")`, // Using mock ID 1 for simplicity
                gas: 200000,
            });

            await tx.wait();
            console.log("NFT Minted successfully:", tx.hash);

        } catch (error) {
            console.error("Minting failed:", error);
            alert(`Minting Error: ${error.message}`);
        }
    };


    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Proof-of-Work NFT Minting</h1>

            <div className="mb-8 p-4 border rounded shadow bg-white">
                <h2 className="text-xl font-semibold mb-3">Mint Project Proof</h2>
                <p className="mb-4 text-sm text-gray-600">Enter project details. The system will simulate a Proof-of-Work hash for the NFT.</p>
                <textarea
                    value={mintDetails}
                    onChange={(e) => setMintDetails(e.target.value)}
                    placeholder="Enter detailed description of your completed project..."
                    rows={4}
                    className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    onClick={handleMint}
                    disabled={loading || !isConnected}
                    className={`mt-3 w-full py-2 px-4 font-semibold rounded transition duration-150 ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    {loading ? 'Processing Proof...' : 'Simulate PoW Mint'}
                </button>
            </div>

            {nftAddress && (
                <div className="mt-10 p-6 border-t-2 border-indigo-500 bg-white shadow">
                    <h2 className="text-2xl font-bold mb-4 text-indigo-700">NFT Details</h2>
                    <p><strong>Wallet Address:</strong> {address}</p>

                    {proofData ? (
                        <div>
                            <h3 className="text-lg font-semibold mt-4">Proof Information</h3>
                            <p><strong>Project Details Stored:</strong> {proofData.details}</p>
                            <p><strong>Proof Hash (PoW Result):</strong> <code className="block p-2 bg-gray-100">{proofData.hash}</code></p>
                            <p><strong>Timestamp:</strong> {new Date(proofData.timestamp * 1000).toLocaleString()}</p>
                        </div>
                    ) : (
                        <p className="text-red-500">Proof details are not yet available.</p>
                    )}
                </div>
            )}

        </div>
    );
}