import React from 'react';

export const NavigationMenu: React.FC = () => {
    return (
        <nav className="flex space-x-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <a href="/" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-150">Home</a>
            <a href="/listings" className="text-gray-700 hover:text-blue-600 transition duration-150">Marketplace</a>
            <a href="/sell" className="text-gray-700 hover:text-blue-600 transition duration-150">List Item</a>
        </nav>
    );
}