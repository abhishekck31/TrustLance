// Component for displaying the network badge (e.g., Ethereum, Polygon).
import React from 'react';

interface NetworkBadgeProps {
  address: string;
}

const NetworkBadge: React.FC<NetworkBadgeProps> = ({ address }) => {
  // Mock detection based on the address prefix or blockchain context setup.
  let network = "Ethereum";
  let colorClass = "bg-indigo-600";

  if (address.startsWith('0x')) {
    network = "Ethereum Mainnet";
    colorClass = "bg-indigo-600";
  } else if (address.startsWith('0x18')) {
    network = "Polygon";
    colorClass = "bg-purple-600";
  } else {
    // Fallback logic
    network = "Unknown Network";
    colorClass = "bg-gray-500";
  }

  return (
    <div className={`p-4 rounded-lg shadow ${colorClass}`}>
      <h3 className="text-lg font-medium text-white">Network Badge</h3>
      <p className="text-xl font-bold text-white">{network}</p>
    </div>
  );
};

export default NetworkBadge;