// This file serves as the main entry point for the Wallet Experience dashboard.
import { useAccount } from 'wagmi';
import Avatar from '@/components/WalletAvatar';
import BalancePreview from '@/components/BalancePreview';
import ENSResolver from '@/components/ENSResolver';
import NetworkBadge from '@/components/NetworkBadge';

export default function WalletExperiencePage() {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">TrustLance Wallet Experience</h1>

      {isConnected ? (
        <div className="w-full max-w-3xl space-y-6 bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700">
          
          {/* 1. Wallet Avatar */}
          <div className="flex items-center space-x-4 border-b pb-4 border-gray-700">
            <Avatar address={address} />
            <div>
              <p className="text-xl font-semibold text-green-400">Connected Address:</p>
              <p className="text-sm truncate">{address}</p>
            </div>
          </div>

          {/* 2. Balance Preview */}
          <BalancePreview address={address} />

          {/* 3. ENS Support */}
          <ENSResolver address={address} />

          {/* 4. Network Badge */}
          <NetworkBadge address={address} />

        </div>
      ) : (
        <div className="p-6 bg-red-900 border border-red-600 rounded-lg">
          <h2 className="text-2xl font-semibold text-red-400">Not Connected</h2>
          <p className="mt-2">Connect your wallet to access your TrustLance data.</p>
        </div>
      )}
    </div>
  );
}