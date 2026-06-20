// Next.js Frontend component for managing Admin Controls.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface AdminStatus {
    address: string;
    isAdmin: boolean;
}

interface MultisigGroup {
    members: string[];
    requiredSigners: number;
}

const AdminDashboard = () => {
    const [targetAddress, setTargetAddress] = useState('');
    const [status, setStatus] = useState<AdminStatus | null>(null);
    const [multisig, setMultisig] = useState<MultisigGroup | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchAdminStatus = async () => {
        if (!targetAddress) return;
        setLoading(true);
        try {
            // Fetch data from the backend API
            const response = await axios.get(`/admin/status/${targetAddress}`);
            setStatus(response.data);
        } catch (error) {
            console.error("Error fetching status:", error);
            setStatus(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchMultisigSetup = async () => {
        try {
            // Fetch multisig configuration from the backend API
            const response = await axios.get('/admin/multisig/group'); // Assuming a new endpoint exists for fetching groups
            setMultisig(response.data);
        } catch (error) {
            console.error("Error fetching multisig setup:", error);
            setMultisig(null);
        }
    };

    const handleCreateGroup = async () => {
        if (!targetAddress || !multisig) return;

        const membersInput = prompt("Enter a comma-separated list of multisig member addresses (e.g., 0xabc..., 0xdef...):");
        if (!membersInput) return;

        const membersArray = membersInput.split(',').map(a => a.trim());
        const requiredSigners = parseInt(prompt("Enter the required number of signatures for this group (Quorum):"));

        if (membersArray.length === 0 || isNaN(requiredSigners)) {
            alert("Invalid input.");
            return;
        }

        try {
            await axios.post('/admin/multisig/create', {
                members: membersArray,
                requiredSigners: requiredSigners
            });
            alert("Multisig group creation proposal sent successfully! Awaiting on-chain execution.");
            fetchMultisigSetup(); // Refresh data
        } catch (error) {
            console.error("Error creating group:", error);
            alert(`Error: ${error.response?.data?.error || "Unknown error"}`);
        }
    };

    useEffect(() => {
        // Initial load simulation (assuming a default address for demonstration)
        if (!targetAddress) {
            setTargetAddress('0x1234567890abcdef1234567890abcdef'); // Placeholder test address
        }
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-indigo-600 mb-6 border-b pb-2">TrustLance Admin Controls</h1>

            <div className="space-y-8 max-w-4xl mx-auto">
                {/* Single Owner Status Control */}
                <div className="bg-white p-6 shadow rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Single Owner Check</h2>
                    <label className="block mb-2 text-sm font-medium">Target Address:</label>
                    <input
                        type="text"
                        value={targetAddress}
                        onChange={(e) => setTargetAddress(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Enter Admin Wallet Address"
                    />
                    <button 
                        onClick={fetchAdminStatus} 
                        disabled={loading || !targetAddress}
                        className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Check Admin Status'}
                    </button>
                    {status && (
                        <div className={`mt-4 p-3 border ${status.isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <strong>Status for {status.address}:</strong> {status.isAdmin ? 'Admin' : 'Standard User'}
                        </div>
                    )}
                </div>

                {/* Multi-Signature Setup Control */}
                <div className="bg-white p-6 shadow rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Multi-Signature Group Setup</h2>
                    <p className='mb-4'>Use this to delegate control to a group of addresses instead of a single owner.</p>

                    <button 
                        onClick={fetchMultisigSetup} 
                        className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 mr-4"
                    >
                        Load Current Group Details
                    </button>

                    <button 
                        onClick={handleCreateGroup}
                        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                    >
                        Propose New Multisig Group
                    </button>

                    {multisig && (
                        <div className="mt-6 p-4 border border-teal-300 bg-teal-50 rounded">
                            <h3 className="text-lg font-bold mb-2 text-teal-800">Current Group Details:</h3>
                            <p><strong>Group Members:</strong> {multisig.members.join(', ')}</p>
                            <p><strong>Required Signatures (Quorum):</strong> {multisig.requiredSigners}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;