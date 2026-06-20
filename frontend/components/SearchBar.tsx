import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (filters: { skill: string; location: string; minRating: string }) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [skill, setSkill] = useState('');
    const [location, setLocation] = useState('');
    const [minRating, setMinRating] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!skill && !location && !minRating) {
            alert("Please enter at least one filter.");
            return;
        }
        onSearch({ skill, location, minRating });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Skill Filter */}
            <div>
                <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">Skill (e.g., Solidity)</label>
                <input
                    id="skill"
                    type="text"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    placeholder="Enter skill keyword..."
                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {/* Location Filter */}
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location (Search in Bio)</label>
                <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location keyword..."
                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {/* Rating Filter */}
            <div>
                <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                <input
                    id="minRating"
                    type="number"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    placeholder="Minimum rating (e.g., 800)"
                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
            >
                Search Freelancers
            </button>
        </form>
    );
};