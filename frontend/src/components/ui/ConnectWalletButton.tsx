"use client";

import React, { useState } from 'react';

export function ConnectWalletButton() {
  const [connected, setConnected] = useState(false);

  return (
    <button
      onClick={() => setConnected(!connected)}
      className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg ${
        connected 
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 hover:shadow-blue-500/25'
      }`}
    >
      {connected ? '0x71C...976F' : 'Connect Wallet'}
    </button>
  );
}
