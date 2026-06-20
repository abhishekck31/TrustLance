'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from 'washi-ui'; // Assuming washi-ui components are available for styling inputs

// Define the structure for the data returned from the backend search
interface Freelancer {
  id: string;
  name: string;
  rating: number;
  bio: string;
}

export default function FreelancerDiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState('');
  const [category, setCategory] = useState('');
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3001/api/freelancers/search', {
        params: {
          name: searchTerm,
          minRating: minRating || undefined,
          category: category,
        }
      });
      setFreelancers(response.data);
    } catch (err) {
      setError('Failed to fetch freelancers. Is the backend running?');
      console.error(err);
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, minRating, category]);

  // Effect to run search whenever parameters change
  // In a real app, use React Query for better caching/state management, but we handle it directly here for simplicity.
  /*
  useQuery({
    queryKey: ['freelancers', searchTerm, minRating, category],
    queryFn: fetchFreelancers,
    enabled: !!searchTerm || !!minRating || !!category, // Only run if at least one filter is set
  });
  */

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFreelancers();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-700">Freelancer Discovery Engine</h1>
        <p className="text-lg text-gray-600 mt-2">Find the perfect talent for your next project.</p>
      </header>

      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">Advanced Search & Filters</h2>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-6 border border-indigo-200 rounded-lg bg-indigo-50">
          {/* Search Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <input
              id="name"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter freelancer name..."
            />
          </div>

          {/* Min Rating */}
          <div>
            <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
            <input
              id="minRating"
              type="number"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              step="0.5"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="WebDev">Web Development</option>
              <option value="Design">Graphic Design</option>
              <option value="Writing">Content Writing</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-4 flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition duration-150 shadow-md"
            >
              Search Freelancers
            </button>
          </div>
        </form>

        {/* Results Display */}
        <div className="mt-8">
          {loading && (
            <div className="text-center py-6 text-indigo-500 font-medium">Loading freelancers...</div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!loading && freelancers.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Found {freelancers.length} Freelancers</h3>
              <div className="space-y-6">
                {freelancers.map((f) => (
                  <div key={f.id} className="border p-4 rounded-lg shadow-sm bg-white">
                    <h4 className="text-xl font-semibold text-indigo-600">{f.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Rating: <span className={`font-bold ${f.rating >= 80 ? 'text-green-600' : 'text-orange-500'}`}>{f.rating}/100</span></p>
                    <p className="mt-2 text-gray-700">{f.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && freelancers.length === 0 && (
             <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
               No freelancers found matching your criteria. Try broadening your search!
             </div>
          )}

        </div>
      </div>
    </div>
  );
}