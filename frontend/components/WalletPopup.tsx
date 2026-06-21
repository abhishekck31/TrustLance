// Component implementing Glassmorphism for the wallet popup.
import { useState } from 'react';

export function WalletPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 text-lg font-semibold rounded-xl shadow-lg transition duration-300 
                   bg-blue-600/70 backdrop-blur-lg border border-blue-400 text-white hover:bg-blue-500"
      >
        Open Wallet Details
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Glassmorphism Modal Content */}
          <div className="w-full max-w-lg rounded-xl shadow-2xl 
                          bg-white/15 backdrop-blur-lg border border-white/30 p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-300 pb-2">Wallet Information</h2>
            <p className="text-gray-100 mb-4">
              This information is displayed using Glassmorphism. Notice the blurred background effect.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-100/50 rounded-lg border border-gray-200">
                <span className="text-gray-700">Address:</span>
                <span className="font-mono text-sm truncate">{`0xabc123...def456`}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-100/50 rounded-lg border border-gray-200">
                <span className="text-gray-700">Balance:</span>
                <span className="font-semibold text-green-600">$12,345.67</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}