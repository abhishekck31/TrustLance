'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api'; // Assume this is configured to point to /api
import { Badge } from '@/types'; // Define the expected type structure
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState<{ tokenId: number, status: string }[]>([]);
    const [currentTokenId, setCurrentTokenId] = useState<number | null>(null);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                // Fetch all available badges (mocking data structure based on backend design)
                const response = await fetch('/api/badges/101'); // Fetch specific badge for demonstration
                if (response.ok) {
                    setBadges([{ ...response.json(), isVerified: false }]);
                }
            } catch (error) {
                console.error("Error fetching badges:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBadges();
    }, []);

    const handleVerify = async () => {
        if (!currentTokenId) return;

        const ownerAddress = '0x1234567890abcdef'; // Mock user address for verification test

        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId: currentTokenId, ownerAddress: ownerAddress })
            });

            const data = await response.json();
            setVerificationStatus(prev => [...prev, { tokenId: currentTokenId, status: data.message }]);

        } catch (error) {
            console.error("Verification failed:", error);
            setVerificationStatus(prev => [...prev, { tokenId: currentTokenId, status: 'Error during verification' }]);
        }
    };


    if (loading) return <div className="p-8 text-center">Loading skill badges...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-4xl font-bold text-gray-900">Verifiable Skill Badges</h1>
                <p className="text-gray-600 mt-2">On-chain certifications for verifiable skills.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                    <Card key={badge.tokenId} className={`shadow-lg transition duration-300 ${badge.isVerified ? 'border-green-500 bg-white' : 'border-gray-300 bg-white'}`}>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-indigo-600">{badge.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                            {!badge.isVerified ? (
                                <Button onClick={() => setCurrentTokenId(badge.tokenId)} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                    Claim & Verify (ID: {badge.tokenId})
                                </Button>
                            ) : (
                                <div className="flex items-center mt-4">
                                    <span className="text-green-600 font-medium mr-2">Verified!</span>
                                    <p className="text-sm text-green-700">Certificate is verified on-chain.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {/* Verification Status Section */}
                <div className="md:col-span-2 lg:col-span-3 mt-10 p-6 border border-indigo-300 rounded-lg bg-indigo-50">
                    <h2 className="text-2xl font-bold text-indigo-800 mb-4">Verification Portal</h2>
                    {currentTokenId && (
                        <>
                            <p className="mb-4">Attempting to verify Badge ID: {currentTokenId}</p>
                            <Button onClick={handleVerify} className="w-full bg-red-600 hover:bg-red-700 text-white">
                                Start On-Chain Verification
                            </Button>
                            {verificationStatus.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    {verificationStatus.map((status, index) => (
                                        <div key={index} className={`p-3 rounded-md border ${status.verified ? 'bg-green-100 border-green-500' : 'bg-yellow-100 border-yellow-500'}`}>
                                            <p className="font-semibold">Status for Token {status.tokenId}:</p>
                                            <p>{status.status}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}


// --- Mock Type Definition (Simulating type inference for demonstration) ---
interface Badge {
    tokenId: number;
    name: string;
    description: string;
    isVerified: boolean;
}

// Note: In a real Next.js setup, the fetch calls would need to be managed within Server Actions or dedicated API routes if they were not mocked client-side.