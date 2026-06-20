// Next.js page displaying the ability to view and request skill badges.
'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract, useWaitForDataFetching } from 'wagmi';
import { getContract } from '@/lib/contracts'; // Assume utility to connect to contracts via ethers/wagmi hooks
import { apiFetch } from '@/lib/api'; // Assume utility for backend calls

export default function SkillBadgeVerifier() {
    const { address, isConnected } = useAccount();
    const [badgeId, setBadgeId] = useState('');
    const [skillName, setSkillName] = useState('');
    const [status, setStatus] = useState('pending');
    const [loading, setLoading] = useState(false);

    // --- Mock On-Chain Data Fetching (Simulated via useReadContract) ---
    // In a real scenario, this fetches data directly from the deployed contract.
    const { data: badgeData, error: contractError } = useReadContract({
        address: '0xSkillBadgeAddress', // Placeholder Contract Address
        abi: [...], // Assume ABI is loaded
        function getSkill(new Date()) // Mock call structure
    });

    // --- Backend Interaction (Verification Flow) ---
    const handleVerify = async () => {
        if (!badgeId || !skillName) return;

        setLoading(true);
        try {
            const response = await apiFetch('/api/badges/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId: badgeId, skillName: skillName, verifiedByHash: '0xproof...' })
            });

            if (response.status === 200) {
                setStatus('success');
                console.log("Verification successful:", response.data);
            } else {
                setStatus('error');
                console.error("Verification failed:", response.data);
            }
        } catch (e) {
            setStatus('error');
            console.error("Network or API error:", e);
        } finally {
            setLoading(false);
        }
    };

    // --- Render Logic ---
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-2">Verifiable Skill Badge System</h1>

            <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Certify Your Skill</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700">On-Chain Badge ID (e.g., 12345):</label>
                        <input
                            id="tokenId"
                            type="text"
                            value={badgeId}
                            onChange={(e) => setBadgeId(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="skillName" className="block text-sm font-medium text-gray-700">Skill Certified:</label>
                        <input
                            id="skillName"
                            type="text"
                            value={skillName}
                            onChange={(e) => setSkillName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={loading || !isConnected}
                        className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition duration-150 ${
                            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                    >
                        {loading ? 'Verifying...' : 'Request On-Chain Verification'}
                    </button>

                    {status === 'success' && (
                         <div className="mt-4 p-3 bg-green-100 text-green-800 border border-green-400 rounded">
                            ✅ Success! Your verification request has been sent to the backend for indexing. Check status later.
                         </div>
                    )}

                    {status === 'error' && (
                        <div className="mt-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">
                            ❌ Error during verification: {status}
                        </div>
                    )}
                </div>

                 {/* Display Simulated On-Chain Status */}
                 <div className="mt-8 pt-6 border-t">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Simulated Badge Status Check</h2>
                     {badgeId && (
                        <div>
                            <p><strong>Badge ID:</strong> {badgeId}</p>
                            <p><strong>Simulated Skill:</strong> Advanced Solidity Development</p>
                            <p><strong>Verification Status:</strong> Pending / Verified (Depends on Backend Indexing)</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
}