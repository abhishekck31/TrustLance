'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Mock Hooks Simulation for Contract Writing ---
const useCreateJob = () => {
    const [formData, setFormData] = useState({ title: '', description: '', salary: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        // In a real app: Sign transaction, call contract.createJob(...)
        console.log("Submitting job data:", formData);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate blockchain latency

        if (formData.title && formData.description && formData.salary) {
            // Success simulation
            alert(`Job "${formData.title}" submitted successfully! Transaction pending on chain.`);
            setFormData({ title: '', description: '', salary: '' });
            setError(null);
        } else {
            setError("Please fill in all fields.");
        }
        setLoading(false);
    };

    return { formData, setFormData, loading, error, handleSubmit };
};
// --- End Mock Simulation ---


export default function CreateJobPage() {
  const router = useRouter();
  const { formData, setFormData, loading, error, handleSubmit } = useCreateJob();

  return (
    <div className="max-w-3xl mx-auto py-10">
      <header className="mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <PlusCircle className="w-7 h-7 mr-2 text-blue-600" /> Create New Job Listing
        </h1>
        <p className="text-gray-600 mt-1">List your job opportunity on the TrustLance platform.</p>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-2xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 transition"
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              id="description"
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 transition"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary Range (e.g., 120k - 140k)</label>
            <input
              type="text"
              id="salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 transition"
              required
            />
          </div>

          {/* Submission */}
          <Button 
            type="submit" 
            className={`w-full flex justify-center items-center text-lg font-semibold transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" /> Submitting...
                </>
            ) : (
                <>
                    <PlusCircle className="w-5 h-5 mr-3" /> Post Job on Blockchain
                </>
            )}
          </Button>

        </form>
      </div>
    </div>
  );
}