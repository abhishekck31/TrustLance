'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Plus } from 'lucide-react';

// Assume Wallet Address is managed by Wagmi context (mocked here)
const MOCK_USER_ADDRESS = "0xabc123..."; // Replace with actual chain interaction result

export default function SavedJobsPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, the backend would authenticate the user session.
      // Here we mock the call to our Node/Prisma backend.
      const response = await axios.get(`http://localhost:3001/api/bookmarks?userId=${MOCK_USER_ADDRESS}`);
      setBookmarks(response.data);
    } catch (err) {
      setError('Failed to fetch bookmarks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleSave = async (jobId, title) => {
    try {
      const response = await axios.post('http://localhost:3001/api/bookmarks', {
        userId: MOCK_USER_ADDRESS, // In production, this comes from the session
        jobId: jobId,
        jobTitle: title,
      });
      console.log('Bookmark saved successfully:', response.data);
      // Refresh list or update state
      fetchBookmarks();
    } catch (err) {
      setError(`Failed to save bookmark: ${err.response?.data?.error || 'Unknown error'}`);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading bookmarks...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">My Saved Jobs</h1>
        <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
          <Plus className="w-5 h-5 mr-2" /> Save New Job
        </button>
      </header>

      {error && <div className="p-3 bg-red-100 text-red-700 mb-4 rounded">{error}</div>}

      {bookmarks.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-lg text-gray-600">You haven't saved any jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="bg-white p-5 rounded-lg shadow border border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{bookmark.jobTitle}</h2>
                <p className="text-sm text-gray-600 mt-1">Job ID: {bookmark.jobId}</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleSave(bookmark.jobId, bookmark.jobTitle)}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Resave
                </button>
                {/* Add a remove button here if the contract allowed direct removal */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}