import HiringDiscovery from '@/components/HiringDiscovery';

export default function HiringPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-10 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900">Public Hiring Opportunities</h1>
        <p className="text-lg text-gray-600 mt-2">Discover open roles available today.</p>
      </header>
      <main>
        {/* The HiringDiscovery component will fetch data from the backend API */}
        <HiringDiscovery />
      </main>
    </div>
  );
}