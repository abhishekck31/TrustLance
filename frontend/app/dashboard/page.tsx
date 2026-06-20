'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, AlertTriangle, Database, List, LogOut } from 'lucide-react';

// Define the structure for an Audit Finding
interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  reportDate: string;
  submittedBy: string;
}

export default function AuditFindingsDashboard() {
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');

  useEffect(() => {
    const fetchFindings = async () => {
      try {
        // Fetch data from the backend API
        const response = await axios.get('http://localhost:3001/api/findings'); 
        setFindings(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };
    fetchFindings();
  }, []);

  const filteredFindings = findings.filter(finding => {
    const matchesSearch = finding.title.toLowerCase().includes(searchTerm.toLowerCase()) || finding.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || finding.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  if (loading) {
    return <div className="p-8 text-center text-xl">Loading Audit Findings...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600 text-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center">
          <Database className="w-8 h-8 mr-3 text-indigo-600" /> Audit Tracker
        </h1>
        <div className="flex space-x-4 items-center">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search findings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-64"
                />
            </div>
            <Filter className="w-5 h-5 text-gray-500" />
        </div>
      </header>

      {/* Filters */}
      <div className="flex space-x-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Severity</label>
            <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as any)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="All">All Findings</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
        </div>
      </div>

      {/* Findings Table */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-6">
          {filteredFindings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No audit findings match your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Report Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFindings.map((finding) => (
                    <tr key={finding.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{finding.id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{finding.title}</td>
                      <td className={`px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            finding.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                            finding.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                            finding.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {finding.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 inline-flex text-sm font-medium rounded-full ${
                            finding.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                            finding.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            finding.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {finding.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(finding.reportDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href={`/findings/${finding.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">View Details</a>
                        {/* Placeholder for actual action buttons */}
                        <button className='text-red-600 hover:text-red-900'>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}