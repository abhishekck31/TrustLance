import { HiringOpportunity } from '@/types/hiring'; // Assuming we define types here or in a shared folder
import { fetchHiringOpportunities } from '@/lib/api';
import HiringBoard from '@/components/HiringBoard';

export default async function HomePage() {
  const opportunities = await fetchHiringOpportunities();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="text-center mb-12 border-b pb-6">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Public Hiring Board
        </h1>
        <p className="text-xl text-gray-600">Discover verified, public opportunities on TrustLance.</p>
      </header>

      <section className="max-w-6xl mx-auto">
        {opportunities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No public hiring opportunities found at this time.</p>
            <p className="mt-2">Check back soon for new listings!</p>
          </div>
        ) : (
          <HiringBoard opportunities={opportunities} />
        )}
      </section>
    </main>
  );
}

// Mock API function definition - In a real app, this would use fetch() to the backend URL
async function fetchHiringOpportunities() {
  // Placeholder: Replace with actual fetch call logic for development setup
  console.log("Fetching data from backend...");
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock Data simulating the expected structure from the backend
  return [
    { id: '1', title: 'Senior Solidity Developer (DAO Focus)', description: 'Seeking a lead developer for our DeFi protocol roadmap.', location: 'Remote (Global)', salary: 140000, postedAt: new Date(), isPublic: true },
    { id: '2', title: 'Frontend React Engineer', description: 'Build the next generation of decentralized application interfaces.', location: 'New York, NY', salary: 95000, postedAt: new Date(Date.now() - 86400000) },
    { id: '3', title: 'Blockchain Data Analyst', description: 'Analyze on-chain data for market trends.', location: 'London, UK', salary: 75000, postedAt: new Date(Date.now() - 172800000) },
  ];
}

// Component Placeholder (Defined below)
interface HiringBoardProps {
    opportunities: HiringOpportunity[];
}

function HiringBoard({ opportunities }: HiringBoardProps) {
    return (
        <div className="space-y-6">
            {opportunities.map((opp) => (
                <div key={opp.id} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 hover:shadow-xl transition duration-300">
                    <h2 className="text-2xl font-bold text-indigo-700 mb-2">{opp.title}</h2>
                    <p className="text-sm text-gray-500 mb-3 flex items-center space-x-3">
                        <span>📍 Location: {opp.location}</span>
                        <span>💰 Salary: ${opp.salary.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-700 mb-4">{opp.description}</p>
                    <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-sm text-gray-500">Posted: {new Date(opp.postedAt).toLocaleDateString()}</span>
                        <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-800 transition">View Details & Apply →</a>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Define the type expected from the backend
interface HiringOpportunity {
    id: string;
    title: string;
    description: string;
    location: string;
    salary: number;
    postedAt: string; // ISO Date string from API
    isPublic: boolean;
}