import { Inter } from 'next/font/google';
import './globals.css';
import { WagmiProvider } from 'wagmi';
import { configureChains, publicProvider } from 'wagmi/core';
import { sepolia, mainnet } from 'rime'; // Assuming we want to support multiple chains or a default
import { MetamaskProvider } from 'rainbowkit';
import { wetherscan } from 'wagmi/chains';
import { publicWalletModal } from 'rainbowkit/modals/publicWalletModal';

// Configure Chains (Setup for Wagmi)
const { chains, publicClient } = configureChains(
  [sepolia, mainnet],
  [publicProvider()]
);

// Define the base structure for context handling (Mock Role Selection)
interface RoleContext {
  role: 'client' | 'freelancer';
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real application, role would be fetched from session/API context.
  // We mock the selection here for demonstration purposes.
  const initialRole = 'client'; 

  return (
    <html lang="en">
      <body>
        <WagmiProvider chains={chains} publicClient={publicClient}>
          {/* We wrap RainbowKit components */}
          <MetamaskProvider>
            <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-12">
              <main className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-xl">
                <header className="mb-8 border-b pb-4">
                  <h1 className="text-4xl font-bold text-gray-900">TrustLance Platform</h1>
                  
                  {/* Role Selection Component */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <label htmlFor="role-select" className="block text-lg font-medium text-blue-800 mb-2">Select Your Role:</label>
                    <select 
                      id="role-select" 
                      value={initialRole} 
                      onChange={(e) => console.log('Role selected:', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="client">Client</option>
                      <option value="freelancer">Freelancer</option>
                    </select>
                  </div>

                  {/* Network Detection Display */}
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
                    <p className="font-semibold text-green-800">Connected Network:</p>
                    {/* Placeholder for dynamic network info based on Wagmi state */}
                    <span id="network-status" className="text-xl font-bold text-green-600">Detecting...</span>
                  </div>

                </header>

                {/* Main Content Area - Where Wallet Connection will happen */}
                <section className="mt-10">
                  {/* Placeholder for the interactive component below */}
                  <p className="text-gray-600">Wallet connection and role-specific features will be displayed here.</p>
                </section>

              </main>
            </div>
          </MetamaskProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}