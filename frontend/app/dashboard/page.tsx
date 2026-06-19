// This file serves as the main unified dashboard page for both clients and freelancers.
import { Zap, Clock, DollarSign, Activity } from 'lucide-react';

// Mock data structure for demonstration purposes
const mockActiveJobs = [
  { id: 101, title: "Web3 Contract Audit", client: "Alice Corp", status: "In Progress", deadline: "2024-08-15" },
  { id: 102, title: "Smart Contract Deployment", client: "Bob Ventures", status: "Awaiting Review", deadline: "2024-09-01" },
  { id: 103, title: "Tokenomics Strategy", client: "Charlie LLC", status: "Completed", deadline: "2024-07-20" },
];

const mockActivityLog = [
  { id: 1, timestamp: "2024-07-28T10:30:00Z", description: "New job 'Web3 Contract Audit' assigned by Alice Corp." },
  { id: 2, timestamp: "2024-07-27T15:45:00Z", description: "Client updated payment terms for project ID 101." },
  { id: 3, timestamp: "2024-07-26T09:00:00Z", description: "Freelancer submitted initial proposal for Tokenomics Strategy." },
];

// Reusable Widget Component
interface JobWidgetProps {
  job: typeof mockActiveJobs[0];
}

const JobWidget: React.FC<JobWidgetProps> = ({ job }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 transition duration-300 hover:shadow-xl">
    <div className="flex items-center justify-between mb-4 pb-3 border-b">
      <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
        job.status === 'Completed' ? 'bg-green-100 text-green-700' :
        'bg-yellow-100 text-yellow-700'
      }`}>
        {job.status}
      </span>
    </div>
    <div className="space-y-3">
      <p className="text-sm text-gray-600 flex items-center"><Clock className="w-4 h-4 mr-2 text-indigo-500" /> Deadline: <span className="font-medium text-gray-800">{job.deadline}</span></p>
      <p className="text-sm text-gray-600 flex items-center"><DollarSign className="w-4 h-4 mr-2 text-indigo-500" /> Client: <span className="font-medium text-gray-800">{job.client}</span></p>
      <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-150">
        View Details
      </button>
    </div>
  </div>
);

// Reusable Activity Log Component
const ActivityLog: React.FC<{ log: typeof mockActivityLog }> = ({ log }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
      <Activity className="w-5 h-5 mr-2 text-red-500" /> Recent Activity Log
    </h3>
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {log.map((item) => (
        <div key={item.id} className="border-b pb-3 last:border-b-0">
          <p className="text-sm text-gray-700 mb-1">{item.description}</p>
          <p className="text-xs text-gray-500">
            {new Date(item.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  </div>
);


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Unified Dashboard</h1>
        <p className="text-lg text-gray-600">Overview of Active Projects and Recent Interactions</p>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Jobs Widgets (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Active Jobs</h2>
          
          {/* Structural Active Jobs Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockActiveJobs.map((job) => (
              <JobWidget key={job.id} job={job} />
            ))}
          </div>

          {/* Recent Activity Log Component */}
          <ActivityLog log={mockActivityLog} />
        </div>

        {/* Right Column: Quick Stats/Calls to Action (1/3 width) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Placeholder for quick stats widgets */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-red-500" /> Performance Summary
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Total Revenue (MTD)</span>
                    <span className="text-xl font-bold text-green-600">$15,450.00</span>
                </div>
                 <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Pending Tasks</span>
                    <span className="text-xl font-bold text-yellow-600">3 Tasks</span>
                </div>
                 <div className="flex justify-between pt-4 border-t">
                    <span className="font-medium text-gray-600">Up for Review</span>
                    <span className="text-xl font-bold text-blue-600">1 Job</span>
                </div>
            </div>
          </div>

           {/* CTA Card */}
           <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold mb-2">Start New Project</h3>
                    <p className="text-indigo-200">Access the platform to initiate your next contract.</p>
                </div>
                <a href="/new-project" className="bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold hover:bg-indigo-50 transition">
                    Create Job
                </a>
           </div>

        </div>
      </div>
    </div>
  );
}