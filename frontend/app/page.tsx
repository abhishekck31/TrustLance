'use client';
import { useState, useEffect } from 'react';
import MilestoneForm from '../components/MilestoneForm';
import axios from 'axios';

// Placeholder API URL - should be configured via environment variables in a real setup
const API_URL = 'http://localhost:3000/api/milestones';

export default function HomePage() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Milestones
  const fetchMilestones = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setMilestones(response.data);
    } catch (err) {
      console.error('Error fetching milestones:', err);
      setError('Failed to load milestones from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  // Handle Form Submission
  const handleFormSubmit = async (data: { title: string; description: string | null; progress: number }) => {
    try {
      const response = await axios.post(API_URL, data);
      console.log('Milestone submitted successfully:', response.data);
      // Refresh the list upon successful submission
      fetchMilestones();
    } catch (err) {
      console.error('Error submitting milestone:', err);
      setError('Failed to submit milestone.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 border-b pb-2">TrustLance Milestone Manager</h1>
        <p className="text-gray-600 mt-2">Track, submit, and manage approval flows for project milestones.</p>
      </header>

      {/* Milestone Submission Form */}
      <div className="max-w-3xl mx-auto mb-12">
        <MilestoneForm onSubmit={handleFormSubmit} />
      </div>

      {/* Milestone List Display */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Current Milestones</h2>

      {loading ? (
        <p className="text-center text-lg text-indigo-500">Loading milestones...</p>
      ) : error ? (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      ) : milestones.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No milestones found.</p>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-indigo-700">{milestone.title}</h3>
                <span className={`px-3 py-1 inline-block rounded-full text-sm font-semibold ${
                    milestone.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    milestone.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    milestone.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  Status: {milestone.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2"><strong>Description:</strong> {milestone.description || 'N/A'}</p>
              <div className="mt-3 border-t pt-3">
                <p className="font-medium">Progress: {milestone.progress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className={`h-2.5 rounded-full ${milestone.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}