// Next.js Frontend component for displaying saved jobs.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext'; // Assuming context exists
import { Job } from '../types/index';

interface FavoriteJob extends Job {
    isFavorite: boolean; // Added for UI state management
}

const FavoritesPage: React.FC = () => {
    const [favorites, setFavorites] = useState<FavoriteJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUserContext(); // Access user context

    useEffect(() => {
        if (!user) return;
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('/api/user/all-favorites');
                setFavorites(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load favorites from server.");
                console.error(err);
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [user]);

    const handleRemoveFavorite = async (jobId: string) => {
        // In a real app, this would trigger a backend call to unfavorite via Web3 interaction
        try {
            await axios.post(`/api/favorites/remove/${jobId}`);
            // Refresh the list client-side
            setFavorites(prev => prev.filter(f => f.id !== jobId));
        } catch (err) {
            setError("Failed to remove favorite.");
        }
    };

    if (loading) return <div>Loading favorites...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6 border-b pb-2">My Saved Jobs & Favorites</h1>
            {favorites.length === 0 ? (
                <p className="text-gray-500 italic">You have no saved jobs yet. Start bookmarking!</p>
            ) : (
                <ul className="space-y-4">
                    {favorites.map((favorite) => (
                        <li key={favorite.id} className="border p-4 rounded-md flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-semibold text-blue-700">{favorite.title}</h2>
                                <p className="text-sm text-gray-600">Job ID: {favorite.job.id}</p>
                            </div>
                            <button
                                onClick={() => handleRemoveFavorite(favorite.id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-150"
                            >
                                Remove Favorite
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavoritesPage;