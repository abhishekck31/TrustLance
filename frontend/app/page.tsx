// Main page component to display the Featured Talent System dashboard.
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Separator } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Assuming utility function exists
import { Star } from 'lucide-react';

interface FeaturedTalent {
    id: string;
    name: string;
    description: string;
    isFeatured: boolean;
    featuredTier: number;
}

export default function HomePage() {
    const [featuredTalents, setFeaturedTalents] = useState<FeaturedTalent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Fetch data from the backend API which interfaces with the smart contracts
                const response = await axios.get('http://localhost:3000/api/talents/featured');
                setFeaturedTalents(response.data);
            } catch (err) {
                setError("Failed to load featured talents.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-50">Loading Featured Talents...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600 bg-red-100 border border-red-400 rounded">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                    Featured Talent Showcase
                </h1>
                <p className="text-xl text-gray-600">Discover the top premium talents on TrustLance.</p>
            </header>

            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 border-b pb-2">Premium Talent List</h2>

                {featuredTalents.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">No featured talents are currently available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredTalents.map((talent) => (
                            <div key={talent.id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 transition duration-300 hover:shadow-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-indigo-700">{talent.name}</h3>
                                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Tier: {talent.featuredTier === 2 ? 'PREMIUM' : 'BASIC'}
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-3">{talent.description}</p>
                                <div className="mt-4 pt-4 border-t">
                                    <p className='text-sm font-medium text-gray-700'>Owner Address:</p>
                                    <a href={`https://explorer.etherscan.io/?address=${talent.owner}`} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:underline">View Profile on Explorer</a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}