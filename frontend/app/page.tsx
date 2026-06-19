'use client';
import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useAddress, useReadContract } from 'wagmi';
import { publicWalletModal } from 'rainbowkit/modals/publicWalletModal';
import { ethers } from 'ethers';

export default function WalletLayout() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, status } = useConnect();
  const { disconnect } = useDisconnect();

  // Mock Network Detection based on chain state
  const networkStatus = status === 'success' 
    ? connectors.length > 0 ? connectors[0].name : 'No Network Detected'
    : 'Disconnected';


  const handleConnect = () => {
    if (status === 'pending') {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <div>
      {isConnected ? (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <p>✅ Wallet Connected successfully!</p>
          <p>Address: {address}</p>
          <p>Network: {networkStatus}</p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
          <p>⚠️ Please connect your wallet to access features.</p>
          <button 
            onClick={() => publicWalletModal()}
            className="mt-3 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* Displaying the connection status and prompting connection */}
      {!isConnected && (
        <div className="mt-8 text-center">
            <p className='text-lg font-medium'>Ready to interact with TrustLance?</p>
            <button 
              onClick={() => publicWalletModal()}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
            >
              Connect Wallet
            </button>
        </div>
      )}

    </div>
  );
}