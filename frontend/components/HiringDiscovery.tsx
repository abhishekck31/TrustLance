'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

// Define the structure for a hiring opportunity (must match backend response)
interface HiringOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary: number | null;
  postedDate: string;
}

export default function HiringDiscovery() {
  const [opportunities, setOpportunities] = useState<HiringOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // Assuming the backend runs on a different port or host (e.g., localhost:3000)
        const response = await axios.get('http://localhost:3000/hiring'); 
        setOpportunities(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load hiring opportunities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xl text-indigo-600">
        <Loader2 className="animate-spin mr-2" /> Loading Opportunities...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {opportunities.length === 0 ? (
        <div className="text-center p-12 bg-white shadow rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-700">No Opportunities Found</h3>
          <p className="text-gray-500 mt-2">We are currently updating our list of public hiring opportunities. Check back soon!</p>
        </div>
      ) : (
        opportunities.map((opp) => (
          <div key={opp.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-2xl font-bold text-indigo-700">{opp.title}</h2>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                opp.type === 'Full-time' ? 'bg-green-100 text-green-800' :
                opp.type === 'Internship' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {opp.type}
              </span>
            </div>
            <p className="text-lg text-gray-700 mb-2"><strong>Company:</strong> {opp.company}</p>
            <p className="text-md text-gray-600 flex items-center mb-4">
                <svg className="w-5 h-5 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 10a3 3 0 11-6 0 3 3 0 016 0zM16 16a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                {opp.location}
            </p>
            <p className="text-gray-800 italic border-t pt-3">"{opp.description}"</p>
            {opp.salary !== null && (
              <div className="mt-4 pt-3 border-t border-dashed">
                <p className="text-sm font-medium text-green-600">Salary Estimate: ${opp.salary.toLocaleString()}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}