// Next.js page to display a user's reputation score. Uses Wagmi/RainbowKit context implicitly for connection.
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

// NOTE: In a real app, Wallet connection and contract addresses must be configured via environment variables.
const REPUTATION_CONTRACT_ADDRESS = "0xYourReputationContractAddress"; // Placeholder
const REPUTATION_READ_FUNCTION = "getReputation"; // Function to call on-chain

export default function ReputationDashboard() {
    const { address, isConnected } = useAccount();
    const [reputationScore, setReputationScore] = useState<string>('Loading...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!isConnected) {
            setError("Wallet not connected. Cannot fetch reputation.");
            setLoading(false);
            return;
        }

        const fetchReputation = async () => {
            try {
                // Use useReadContract hook for direct on-chain reading (best practice with Wagmi)
                const { data, error } = await useReadContract({
                    address: REPUTATION_CONTRACT_ADDRESS,
                    abi: [/* ABI of Reputation.sol */], // Must be provided
                    functionName: REPUTATION_READ_FUNCTION,
                    args: [address],
                });

                if (error) {
                    throw new Error(error.message || "Failed to read reputation from contract.");
                }

                if (data !== null) {
                    // Assuming the Solidity returns a uint256 score, we convert it for display
                    setReputationScore(data.toString()); 
                } else {
                    setReputationScore("N/A");
                }

            } catch (err) {
                setError(`Error: ${err.message}`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReputation();
    }, [isConnected, address]); // Re-run when connection status changes


    if (loading) return <div className="p-8 text-center">Loading Reputation Data...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-10 max-w-4xl mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">TrustLance Reputation Score</h1>
            
            <div className="bg-white shadow-xl rounded-lg p-6 border border-indigo-200">
                <p className="text-lg mb-4 text-gray-600">Your Current Reputation:</p>
                <div className="text-center py-10">
                    <span className={`text-7xl font-extrabold ${reputationScore === 'N/A' ? 'text-gray-400' : 'text-indigo-600'}`}>
                        {reputationScore}
                    </span>
                </div>
                <p className="mt-4 text-sm text-gray-500">Score reflects on-chain data, subject to the Reputation Decay Model.</p>
            </div>

            <div className="mt-8 p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
                <h3 className="font-semibold mb-2">Decay Model Note</h3>
                <p>The score is dynamically adjusted via the `applyDecay` function based on time elapsed since the last recorded update, utilizing a configured decay rate defined in the contract.</p>
            </div>
        </div>
    );
}