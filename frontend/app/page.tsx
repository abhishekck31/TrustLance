// Next.js Frontend Page for the Marketplace
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { RainbowKit } from 'rainbowkit';
import axios from 'axios';

// --- Mock Data Fetching Functions (Simulating API calls) ---
const fetchMarketplaceData = async (category: string) => {
    // In a real app, this would hit the /api/listings/:category endpoint on the backend
    console.log(`Fetching data for category: ${category}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    if (category === 'Design') {
        return [
            { id: '1', title: 'UX Design Kit', price: 50.0, seller: 'Alice', isSold: false },
            { id: '2', title: 'UI Mockups', price: 75.0, seller: 'Bob', isSold: true },
        ];
    } else if (category === 'Dev') {
        return [
            { id: '3', title: 'React Component', price: 15.0, seller: 'Charlie', isSold: false },
        ];
    } else if (category === 'AI') {
        return [
            { id: '4', title: 'GPT Prompt Pack', price: 30.0, seller: 'David', isSold: false },
        ];
    }
    return [];
};

export default function MarketplacePage() {
    const [selectedCategory, setSelectedCategory] = useState('Design');
    const { address, isConnected } = useAccount();

    // Fetch listings using TanStack Query
    const { data, isLoading, error } = useQuery({
        queryKey: ['listings', selectedCategory],
        queryFn: () => fetchMarketplaceData(selectedCategory),
    });

    const handleCreateListing = async () => {
        if (!isConnected) {
            alert("Please connect your wallet to create a listing.");
            return;
        }
        // In production, this would trigger a transaction initiated by the user's wallet
        console.log(`Initiating listing creation for ${selectedCategory}`);
        // Simulate API call to backend POST /api/listings/create
        await axios.post('http://localhost:3000/api/listings/create', {
            category: selectedCategory,
            title: `New ${selectedCategory} Item`,
            price: 100,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-indigo-600">TrustLance Marketplace</h1>
                <div>
                    {!isConnected ? (
                        <button 
                            onClick={() => alert('Connect Wallet functionality pending setup.')}
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition"
                        >
                            Connect Wallet
                        </button>
                    ) : (
                         <p className="text-sm text-gray-600">Connected: {address ? address.substring(0, 6) + '...' : 'N/A'}</p>
                    )}
                </div>
            </header>

            {/* Category Selector */}
            <div className="mb-8 p-4 bg-white shadow rounded-lg flex items-center space-x-4">
                <label htmlFor="category" className="font-semibold text-gray-700">Browse Category:</label>
                <select 
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="Design">Design</option>
                    <option value="Dev">Dev</option>
                    <option value="AI">AI</option>
                    <option value="Marketing">Marketing</option>
                </select>
            </div>

            {/* Listing Creation Section */}
            <div className="bg-white p-6 shadow rounded-lg mb-8 border border-indigo-200">
                <h2 className="text-xl font-semibold text-indigo-700 mb-4">List an Item</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateListing();
                }}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input 
                            type="text" 
                            value={selectedCategory}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input 
                            type="text" 
                            id="title" 
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (ETH/USD)</label>
                        <input 
                            type="number" 
                            id="price" 
                            step="0.01"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
                    >
                        List Item on Chain
                    </button>
                </form>
            </div>

            {/* Marketplace Listings Section */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Marketplace: {selectedCategory}
            </h2>

            {isLoading && <p className="text-center mt-10 text-indigo-500">Loading marketplace data...</p>}
            {error && <p className="text-center mt-10 text-red-500">Error loading data.</p>}

            {!isLoading && data && (
                <div className="space-y-4">
                    {data.length > 0 ? (
                        data.map((listing) => (
                            <div key={listing.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center border-l-4 border-indigo-500">
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">{listing.title}</p>
                                    <p className="text-sm text-gray-600">Seller: {listing.seller}</p>
                                    <p className={`text-xl font-bold mt-1 ${listing.isSold ? 'text-red-500' : 'text-green-600'}`}>
                                        {listing.price.toFixed(2)} ETH
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${listing.isSold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {listing.isSold ? 'SOLD' : 'Available'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-6 bg-white rounded-lg shadow">No listings found for this category yet.</p>
                    )}
                </div>
            )}

        </div>
    );
}