// Frontend component to fetch and display the linked events.
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventHistory = async () => {
            try {
                // Fetch data from the backend API
                const response = await axios.get('http://localhost:3001/api/events/history');
                setEvents(response.data);
            } catch (err) {
                console.error('Error fetching event history:', err);
                setError('Failed to load historical event data.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventHistory();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-lg">Loading on-chain event feeds...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Escrow Event Feed History</h1>

            {events.length === 0 ? (
                <div className="text-center p-10 bg-white shadow rounded-lg">
                    No historical events found.
                </div>
            ) : (
                <div className="space-y-6">
                    {events.map((event, index) => (
                        <div key={index} className="bg-white p-5 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                            <h2 className="text-xl font-semibold mb-3 text-blue-700">Event #{index + 1}: {event.eventName}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <p><strong>Block Number:</strong> {event.blockNumber}</p>
                                <p><strong>From:</strong> {event.from}</p>
                                <p><strong>To:</strong> {event.to}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t">
                                <p className="font-medium mb-2">Amount: {event.amount}</p>
                                <a 
                                    href={event.blockExplorerUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition"
                                >
                                    View on Explorer
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}