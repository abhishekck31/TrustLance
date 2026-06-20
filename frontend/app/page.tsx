'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Activity } from '@/types/activity'; // Assuming types are defined elsewhere or imported
import Spinner from '@/components/Spinner';

// Base URL for the backend API
const API_URL = 'http://localhost:3001';

export default function ActivityTimelinePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError, error: fetchError } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/api/activities`);
        return response.data;
      } catch (err) {
        throw new Error(err.message || 'Network error fetching activities');
      }
    },
  });

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    } else if (isError) {
      setError('Failed to load activity timeline.');
    } else {
      setActivities(data);
      setIsLoading(false);
    }
  }, [data, isLoading, isError, error]);

  if (isLoading) {
    return <Spinner message="Loading Activity Timeline..." />;
  }

  if (error) {
    return <div className="text-red-600 p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Project Activity Timeline</h1>

      {activities.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-gray-500 italic">No activities found yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 transition hover:shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-900">{activity.title}</h2>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  activity.type === 'Deployment' ? 'bg-green-100 text-green-800' :
                  activity.type === 'Feature Release' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.type}
                </span>
              </div>
              <p className="text-gray-600 mb-3 border-b pb-2">Date: {new Date(activity.date).toLocaleDateString()}</p>
              <p className="text-gray-700 whitespace-pre-wrap">{activity.description}</p>
              {activity.details && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-2">Details:</h3>
                  <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto text-gray-700">{activity.details}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}