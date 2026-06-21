// Setting up a basic layout to demonstrate the application of glassmorphism concepts.
import { WalletPopup } from '@/components/WalletPopup';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { ModalComponent } from '@/components/ModalComponent';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8 flex justify-center items-start">
      {/* Main Content Area */}
      <div className="w-full max-w-6xl mt-12 space-y-8">
        <h1 className="text-4xl font-bold text-white border-b border-gray-700 pb-4">TrustLance Dashboard</h1>

        {/* Wallet Popup Example (Glassmorphism) */}
        <WalletPopup />

        {/* Analytics Cards Example (Glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnalyticsCard title="Total Value" value="$12,345.67" color="bg-blue-500/30 border-blue-400" />
          <AnalyticsCard title="Transactions" value="42" color="bg-green-500/30 border-green-400" />
          <AnalyticsCard title="APY" value="8.5%" color="bg-yellow-500/30 border-yellow-400" />
        </div>

        {/* Modal Example (Glassmorphism) */}
        <ModalComponent title="Settings Modal" onClose={() => { /* logic to close */ }}>
          <p className="text-gray-200 mt-4">This is a sample modal implemented with Glassmorphism.</p>
          <button className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Save</button>
        </ModalComponent>
      </div>
    </div>
  );
}