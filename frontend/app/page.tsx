// Main marketplace landing page component
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { RainbowKitProvider, useRainbowKit } from '@rainbow-me/rainbowkit';
import { WAGMI } from 'wagmi';

// Define types based on backend/frontend communication
interface Listing {
    id: number;
    title: string;
    categoryName: string;
    price: number;
    sellerAddress: string;
}

export default function MarketplacePage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mock/Placeholder for Web3 connection state (In a real app, this would be derived from Wagmi hooks)
    const { address, isConnected } = useRainbowKit();

    const fetchListings = async (category: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:3000/listings/category/${category}`);
            setListings(response.data);
        } catch (err: any) {
            setError(`Failed to fetch listings for ${category}. Check if the category exists.`);
            console.error(err);
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load default data on component mount
        fetchListings('Design');
    }, []);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        setSelectedCategory(category);
        fetchListings(category);
    };


    return (
        <RainbowKitProvider chains={[]} accounts={[]}>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
                <header className="max-w-6xl mx-auto mb-8 bg-white shadow-lg rounded-xl p-6">
                    <h1 className="text-4xl font-extrabold text-indigo-700 border-b pb-3">TrustLance Marketplace</h1>
                    <p className="text-gray-600 mt-2">Discover and trade digital assets across various categories.</p>
                </header>

                <main className="max-w-6xl mx-auto">
                    {/* Category Selector */}
                    <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                        <label htmlFor="category-select" className="text-lg font-medium text-gray-700">Filter by Category:</label>
                        <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        >
                            {/* Dynamically populate categories based on mock data or backend call */}
                            <option value="" disabled>Select a Category</option>
                            <option value="Design">Design</option>
                            <option value="Dev">Dev</option>
                            <option value="AI">AI</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>

                    {/* Listings Display */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                        Listings in {selectedCategory || 'Design'}
                    </h2>

                    {loading && (
                        <div className="text-center py-10 text-indigo-600 font-semibold">Loading listings...</div>
                    )}

                    {error && (
                        <div className="text-center py-10 text-red-600 bg-red-100 border border-red-400 rounded-lg mx-auto max-w-xl">{error}</div>
                    )}

                    {!loading && listings.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map((listing) => (
                                <div key={listing.id} className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 transition duration-300 hover:shadow-xl">
                                    <h3 className="text-xl font-semibold text-indigo-800 mb-2">{listing.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3 flex items-center">
                                        <span className="bg-indigo-100 text-indigo-700 font-medium px-3 py-1 rounded-full text-xs">{listing.categoryName}</span>
                                    </p>
                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <p className="text-2xl font-bold text-green-600">${listing.price}</p>
                                        <p className={`font-medium ${listing.status === 'sold' ? 'text-red-500' : 'text-gray-500'}`}>
                                            Status: {listing.status.toUpperCase()}
                                        </p>
                                        {/* Placeholder for Web3 Action Button */}
                                        <button
                                            onClick={() => alert(`Attempting to buy listing ID: ${listing.id} for $${listing.price}`)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                                                listing.status === 'active' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-400 text-gray-100 cursor-not-allowed'
                                            }`}
                                            disabled={listing.status !== 'active'}
                                        >
                                            {listing.status === 'active' ? 'Buy Now' : 'Sold'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                     {!loading && listings.length === 0 && (
                        <div className="text-center py-10 bg-white rounded-xl shadow-lg border border-gray-300">
                            <p className="text-xl text-gray-500">No active listings found in this category yet.</p>
                            <p className='mt-2 text-sm'>Try creating a new listing to start the marketplace!</p>
                        </div>
                    )}

                </main>
            </div>
        </RainbowKitProvider>
    );
}