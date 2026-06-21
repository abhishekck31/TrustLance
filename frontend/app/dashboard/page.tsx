// Assuming this page will house the main dashboard where these searches are initiated.
import { SearchCommandPalette } from '@/components/SearchCommandPalette';
import { fetchJobs, fetchEscrows, fetchUsers, fetchDisputes } from '@/lib/api';
import { useState, useCallback } from 'react';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({ jobs: [], escrows: [], users: [], disputes: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((type: 'jobs' | 'escrows' | 'users' | 'disputes', term: string) => {
    setLoading(true);
    // Simulate API calls based on the search term and type
    setTimeout(() => {
      let data = [];
      if (term) {
        // In a real app, this would call the backend API with filtering parameters
        data = [
          { id: 1, name: `${type} Search Result for "${term}"` },
          { id: 2, name: `${type} Item A found` }
        ];
      } else {
        data = [{ id: 0, name: `All ${type}s` }];
      }
      setResults(prev => ({ ...prev, [type]: data }));
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    // Optionally, trigger search immediately on input change for instant feedback
    if (term.length > 1) {
        handleSearch('jobs', term); // Example: default to jobs search on typing
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">TrustLance Dashboard</h1>

      {/* Command Palette Integration */}
      <SearchCommandPalette 
        searchTerm={searchTerm}
        onSearch={handleSearch}
        isLoading={loading}
      />

      {/* Search Results Display */}
      <div className="mt-10 space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">Search Results</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Jobs Search */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-medium mb-2 text-blue-700">Jobs</h3>
            <p>Search for open job listings...</p>
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">{results.jobs.map(j => <div key={j.id} className="border p-2 bg-gray-50">Job ID: {j.id} - {j.name}</div>)}</div>
          </div>

          {/* Escrows Search */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-medium mb-2 text-green-700">Escrows</h3>
            <p>Search for pending escrow transactions...</p>
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">{results.escrows.map(e => <div key={e.id} className="border p-2 bg-gray-50">Escrow ID: {e.id} - {e.name}</div>)}</div>
          </div>

          {/* Users Search */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-medium mb-2 text-purple-700">Users</h3>
            <p>Search for user profiles...</p>
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">{results.users.map(u => <div key={u.id} className="border p-2 bg-gray-50">User ID: {u.id} - {u.name}</div>)}</div>
          </div>

          {/* Disputes Search */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-medium mb-2 text-red-700">Disputes</h3>
            <p>Search for active disputes...</p>
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">{results.disputes.map(d => <div key={d.id} className="border p-2 bg-gray-50">Dispute ID: {d.id} - {d.name}</div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}