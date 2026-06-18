"use client";

import { useState, useCallback, useMemo } from "react";
import { Wagmi, createConfig, mainnet } from "wagmi";
import { publicWallet } from "rainbowkit";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { chain } from "wagmi/chains";

// --- Mock Role Selection Component ---
interface RoleSelectorProps {
  role: 'client' | 'freelancer';
  onSelect: (role: 'client' | 'freelancer') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ role, onSelect }) => {
  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Select Your Role</h3>
      <div className="space-y-2">
        <button
          onClick={() => onSelect('client')}
          className={`w-full p-3 text-left rounded-md transition duration-150 ${
            role === 'client' ? 'bg-blue-600 text-white shadow' : 'bg-white hover:bg-gray-100'
          }`}
        >
          Client
        </button>
        <button
          onClick={() => onSelect('freelancer')}
          className={`w-full p-3 text-left rounded-md transition duration-150 ${
            role === 'freelancer' ? 'bg-green-600 text-white shadow' : 'bg-white hover:bg-gray-100'
          }`}
        >
          Freelancer
        </button>
      </div>
    </div>
  );
};

// --- Main Wallet Layout Component ---
export default function WalletLayout() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [role, setRole] = useState<'client' | 'freelancer'>('client'); // Default role

  // Wagmi Setup (Simplified for demonstration. In a real app, this config would be loaded from environment/server)
  const config = createConfig({
    chains: [mainnet],
    publicClient: await import("viem").then(m => m.createPublicClient({ transport: "eth", url: "https://eth.mainnet" })),
  });

  const { address, isConnected, connect, disconnect } = useAccount();
  const { publicWallet } = useConnect();
  const { status } = useWallet(); // Use wallet hook for broader context if needed, though useAccount covers most needs here.


  const handleConnect = useCallback(async (publicWallet: any) => {
    if (publicWallet) {
      try {
        // In a real application, this step would involve signing and sending transactions
        console.log("Wallet connected:", publicWallet);
        setWalletAddress(publicWallet.address);
        // Simulate fetching user data based on connection
        // In a production app, you might call an API endpoint here to confirm role or fetch profile
      } catch (error) {
        console.error("Connection failed:", error);
      }
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setWalletAddress(null);
  }, [disconnect]);

  const handleRoleSelect = useCallback((selectedRole: 'client' | 'freelancer') => {
    setRole(selectedRole);
    console.log(`Role selected: ${selectedRole}`);
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-xl bg-white p-8 shadow-2xl rounded-xl">
        <header className="text-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">TrustLance Dashboard</h1>
          <p className="text-gray-500 mt-2">Wallet Connection & Role Setup</p>
        </header>

        {/* Wallet Connection Section */}
        <div className="mb-8 p-6 border-4 border-dashed border-blue-300 rounded-lg bg-blue-50">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Connect Your Wallet</h2>

          {!isConnected ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-gray-600">Please connect a wallet to proceed.</p>
              {/* RainbowKit integration */}
              <publicWallet
                // Placeholder for actual configuration/options if needed
                wallet={null} 
                action={connect}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-medium text-green-700 flex items-center">
                ✅ Wallet Connected! Address: <span className="font-mono ml-2">{walletAddress || "N/A"}</span>
              </p>
              <p className="text-sm text-gray-600">You are successfully connected to the blockchain network.</p>
              
              {/* Role Selection Integration */}
              <RoleSelector 
                role={role}
                onSelect={handleRoleSelect}
              />

              <div className="pt-4 border-t mt-6">
                 <button
                    onClick={handleDisconnect}
                    className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                 >
                    Disconnect Wallet
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Display Current State */}
        <div className="mt-8 p-4 border-t pt-4">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Current Status</h3>
            <p><strong>Connected:</strong> {isConnected ? "Yes" : "No"}</p>
            <p><strong>Role Assigned:</strong> <span className={`font-bold ${role === 'client' ? 'text-blue-600' : 'text-green-600'}`}>{role.toUpperCase()}</span></p>
        </div>

      </div>
    </div>
  );
}