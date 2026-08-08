'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming shadcn-like components

// --- Mock Data & Hooks Simulation ---
// In a real application, this data would be fetched via a custom hook calling the blockchain.
interface JobListing {
  id: string;
  title: string;
  description: string;
  salary: string;
  status: 'open' | 'closed';
}

const mockJobList: JobListing[] = [
  { id: 'job1', title: 'Senior Solidity Developer', description: 'Seeking an expert in smart contract development.', salary: '150k - 180k', status: 'open' },
  { id: 'job2', title: 'Web3 Frontend Engineer', description: 'Develop engaging user interfaces for dApps.', salary: '120k - 140k', status: 'open' },
  { id: 'job3', title: 'Blockchain Auditor', description: 'Review security protocols for DeFi applications.', salary: '130k - 160k', status: 'open' },
];

// Custom hook simulation to fetch data from the contract
const useJobListings = () => {
  const [listings, setListings] = useState<JobListing[]>(mockJobList);
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    // Simulate API call delay for blockchain data fetching
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  return { listings, loading, fetchListings };
};
// --- End Mock Simulation ---


export default function JobListingsPage() {
  const { listings, loading, fetchListings } = useJobListings();

  const handleFetch = () => {
    fetchListings();
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
        <Button onClick={handleFetch} disabled={loading} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
            Refresh Jobs
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
          <p className="text-lg text-gray-600">Loading jobs from the blockchain...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((job) => (
            <Card key={job.id} className="shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{job.description}</p>
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        Status: {job.status.toUpperCase()}
                    </span>
                    <p className="text-lg font-bold text-blue-600">{job.salary}</p>
                </div>
              </CardContent>
              <Link href={`/job/${job.id}`} className="mt-4 block text-center w-full">
                <Button variant="outline" className="w-full border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 transition">
                    View Details
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}