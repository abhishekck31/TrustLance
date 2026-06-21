// Component demonstrating Card hover elevation and scaling effects.
import React from 'react';

interface WalletCardProps {
  title: string;
  value: string;
  status: 'Active' | 'Warning' | 'Success';
}

export const WalletCard: React.FC<WalletCardProps> = ({ title, value, status }) => {
  const baseClasses = "p-6 bg-white rounded-xl shadow-md transition duration-300 ease-in-out cursor-pointer border";
  
  // Dynamic styling based on status (for visual differentiation)
  let statusClasses = "";
  switch (status) {
    case 'Success':
      statusClasses = "border-green-400 bg-green-50 shadow-green-200 hover:shadow-xl";
      break;
    case 'Warning':
      statusClasses = "border-yellow-400 bg-yellow-50 shadow-yellow-200 hover:shadow-xl";
      break;
    case 'Active':
    default:
      statusClasses = "border-blue-400 bg-blue-50 shadow-blue-200 hover:shadow-xl";
      break;
  }

  return (
    <div className={`${baseClasses} ${statusClasses}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-3xl font-extrabold text-indigo-600 mb-4">{value}</p>
      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${status === 'Success' ? 'bg-green-200 text-green-800' : status === 'Warning' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>
        {status}
      </span>
    </div>
  );
};