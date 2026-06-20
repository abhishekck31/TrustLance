// Integrating the new command palette into the main page for demonstration

import CommandPalette from './components/CommandPalette';
import { useState } from 'react';

export default function HomePage() {
  const sampleCommands = [
    "Connect Wallet",
    "View Transactions",
    "Manage Settings",
    "Add New Contract",
    "Execute Trade",
    "Advanced Debug View"
  ];
  const [showPalette, setShowPalette] = useState(false);

  const handleSelectCommand = (command: string) => {
    console.log("Selected Command:", command);
    setShowPalette(false); // Close palette after selection
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header / Main Content */}
      <header className="mb-12 border-b pb-4">
        <h1 className="text-4xl font-bold text-indigo-600">TrustLance Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">Welcome to the Advanced Interface.</p>
      </header>

      {/* Action Button to Trigger Command Palette */}
      <button
        onClick={() => setShowPalette(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
      >
        ⌘K Open Advanced Commands
      </button>

      {/* Command Palette Component */}
      {showPalette && (
        <CommandPalette
          items={sampleCommands}
          onSelect={handleSelectCommand}
        />
      )}

      {/* Main Dashboard Content */}
      <main className="mt-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-700">Use the command palette above to quickly access advanced features like connecting wallets, viewing transaction history, and managing contract states.</p>
      </main>
    </div>
  );
}