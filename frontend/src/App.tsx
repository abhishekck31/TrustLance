import React from 'react';

function App() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-indigo-600 mb-4">TrustLance Governance Portal</h1>
            <p className="mb-6 text-lg">Treasury Allocation Voting System</p>
            <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
                <p>Wallet Connection Status: Connected (Simulated)</p>
                <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Connect Wallet</button>
            </div>
        </div>
    );
}

export default App;