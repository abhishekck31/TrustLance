// Next.js frontend component displaying the featured talent list.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';

const FEATURED_TALENTS_API = 'http://localhost:3001/api/talents'; // Link to mock backend

export default function Home() {
    const [talents, setTalents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTalents = async () => {
            try {
                // Fetch all talents (In a real app, this would filter by isFeatured=true on the blockchain)
                const response = await axios.get(`${FEATURED_TALENTS_API}/all`); // Mock endpoint assumption
                setTalents(response.data);
            } catch (err) {
                console.error("Error fetching featured talents:", err);
                setError("Failed to load featured talents.");
            } finally {
                setLoading(false);
            }
        };
        fetchTalents();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Featured Talent Data...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Head>
                <title>TrustLance - Featured Talent</title>
            </Head>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-indigo-700">Featured Talent Showcase</h1>
                <p className="text-lg text-gray-600 mt-2">Premium visibility for the best talent.</p>
            </header>

            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
                {talents.length === 0 ? (
                    <p className="text-center text-gray-500">No featured talents are currently available.</p>
                ) : (
                    <ul className="space-y-4">
                        {talents.map((talent) => (
                            <li key={talent.id} className={`p-4 border rounded-md transition duration-300 ${talent.isFeatured ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'bg-gray-50 border-l-4 border-gray-200'}`}>
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-semibold text-gray-800">{talent.name}</h2>
                                    {talent.isFeatured && (
                                        <span className="inline-block bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">FEATURED</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">ID: {talent.id}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}