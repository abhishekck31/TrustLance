import { EmptyStatesContainer } from './empty-states/EmptyStatesContainer';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 sm:p-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">TrustLance Dashboard</h1>
        <p className="mt-2 text-lg text-gray-500">Explore your Web3 activities.</p>
      </header>

      {/* Display the Beautiful Empty States */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Quick Access Areas</h2>
        <EmptyStatesContainer />
      </section>

    </div>
  );
}