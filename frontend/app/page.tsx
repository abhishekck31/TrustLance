"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'wagmi';
import { useAccount } from 'wagmi';

// Define the structure for a bookmark item
interface Bookmark {
  id: number;
  title: string;
  url: string;
  isJob: boolean;
}

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: account } = useAccount();

  // --- Mocking Wallet/Auth Setup ---
  // In a real app, you would use useWalletClient or similar to get the connected address.
  const userAddress = "0x1234567890abcdef1234567890abcdef"; // Mocked User Address

  const fetchBookmarks = async () => {
    if (!account) {
      setError("Wallet not connected.");
      setLoading(false);
      return;
    }
    
    try {
      // Since our backend is running locally, we hit the Node API
      const response = await axios.get(`http://localhost:3001/bookmarks/${userAddress.substring(0, 20)}`); // Using a truncated address mock for demonstration
      setBookmarks(response.data as Bookmark[]);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError("Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [account]); // Refetch when wallet connection changes

  const createBookmark = async (title: string, url: string, isJob: boolean) => {
    if (!account) return;

    try {
      const response = await axios.post('http://localhost:3001/bookmarks', {
        userId: account.address, // Sending the connected address as the user ID proxy
        title,
        url,
        isJob,
      });
      console.log("Bookmark created:", response.data);
      // Refetch data after successful creation
      fetchBookmarks(); 
    } catch (err) {
      setError(`Failed to create bookmark: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">TrustLance Bookmarks</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
      {loading ? (
        <p className="text-center text-gray-500">Loading bookmarks...</p>
      ) : (
        <div className="space-y-6">
          {bookmarks.length === 0 && !loading ? (
            <p className="text-center text-gray-500">You have no bookmarks yet.</p>
          ) : (
            bookmarks.map((bookmark) => (
              <div key={bookmark.id} className={`p-4 rounded-lg shadow border ${bookmark.isJob ? 'bg-blue-50 border-blue-300' : 'bg-green-50 border-green-300'}`}>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{bookmark.title}</h2>
                <p className="text-sm text-gray-600 mb-3">
                  Type: {bookmark.isJob ? "Saved Job" : "Favorite"}
                </p>
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  {bookmark.isJob ? 'View Job' : 'Visit Link'}
                </a>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-10 pt-6 border-t">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add New Bookmark</h2>
        <form onsubmit={(e) => {
          e.preventDefault();
          createBookmark(
            e.target.elements.title.value,
            e.target.elements.url.value,
            e.target.elements.isJob.checked
          );
        }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" name="title" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input type="url" name="url" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex items-center mb-6">
            <input
              id="isJob"
              name="isJob"
              type="checkbox"
              checked={true} // Default to true (Saved Job)
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isJob" className="ml-3 block text-sm font-medium text-gray-700">
              Save as Job (Bookmark)
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Bookmark
          </button>
        </form>
      </div>
    </div>
  );
}