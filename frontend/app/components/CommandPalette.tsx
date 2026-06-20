// Implementation for the Advanced Command Palette UI component

import React, { useState } from 'react';

interface CommandPaletteProps {
  items: string[];
  onSelect: (item: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ items, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      {/* Command Palette Container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
        {/* Search Input */}
        <div className="p-4 border-b flex items-center">
          <input
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredItems.length === 0 && searchTerm ? (
            <p className="p-4 text-gray-500">No commands found.</p>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className="p-4 cursor-pointer hover:bg-indigo-50 transition duration-150"
                onClick={() => onSelect(item)}
              >
                {item}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;