'use client';

import { useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { FreelancerCard } from '@/components/FreelancerCard';
import { SearchResults } from '@/components/SearchResults';

export default function HomePage() {
  const [filters, setFilters] = useState({ skill: '', location: '', minRating: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (filters: { skill: string; location: string; minRating: string }) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call to the backend search endpoint
      const response = await fetch(`/api/freelancers?skill=${filters.skill}&location=${filters.location}&minRating=${filters.minRating}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Failed to fetch results from the server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Example of how to pre-populate or handle initial search state if needed
  const handleApplyFilters = (filters: { skill: string; location: string; minRating: string }) => {
      handleSearch(filters);
  }


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-600">TrustLance Discovery Engine</h1>
        <p className="text-gray-600 mt-2">Find top talent based on skills, location, and rating.</p>
      </header>

      {/* Search and Filter Controls */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Advanced Search & Filters</h2>
        
        {/* Using a simplified filter interface for demonstration */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <input 
                    type="text" 
                    value={filters.skill}
                    onChange={(e) => setFilters({...filters, skill: e.target.value})}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location (Bio Search)</label>
                <input 
                    type="text" 
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                <input 
                    type="number" 
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: e.target.value})}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
             <div className="flex items-end">
                <button
                    onClick={() => handleApplyFilters(filters)}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                    {loading ? 'Searching...' : 'Apply Filters'}
                </button>
            </div>
        </div>

      </div>

      {/* Results Display */}
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded mb-4">{error}</div>
        )}

        {!loading && results.length > 0 && (
            <SearchResults freelancers={results} />
        )}

        {!loading && results.length === 0 && !error && (
             <div className="text-center p-10 bg-white rounded-lg shadow">
                <p className="text-xl text-gray-500">No freelancers found matching your criteria.</p>
            </div>
        )}

      </div>
    </div>
  );
}