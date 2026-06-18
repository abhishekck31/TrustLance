import { Inter } from 'next/font/google';
import { Loader2, Search, PlusCircle } from 'lucide-react';
import Link;
import { Button } from '@/components/ui/button'; // Assuming a simple component library hook exists
import { Wallet } from 'lucide-react';

const font = Inter({ subsets: ['latin'] });

export default function HomePage() {
  return (
    <div className={`${font.className} min-h-screen bg-gray-50 p-8`}>
      <header className="flex justify-between items-center border-b pb-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center">
          TrustLance Web3 Jobs
        </h1>
        <div>
          <Link href="/create-job" className="mr-4 text-blue-600 hover:text-blue-800 font-medium transition">
            Create Job
          </Link>
          <Link href="/listings" className="mr-4 text-blue-600 hover:text-blue-800 font-medium transition">
            Job Listings
          </Link>
        </div>
      </header>

      <main className="space-y-12">
        {/* Placeholder for dynamic content or dashboard */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to TrustLance</h2>
            <p className="text-gray-600">Explore decentralized job opportunities and manage your contracts securely via Web3.</p>
        </div>
      </main>

      <footer className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
        Built with Next.js, Tailwind CSS, and Web3 integration.
      </footer>
    </div>
  );
}