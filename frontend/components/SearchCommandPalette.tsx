// Component responsible for the Command Palette UI and input handling.
import React, { useState, useEffect, useRef } from 'react';

export interface SearchCommandPaletteProps {
  searchTerm: string;
  onSearch: (type: 'jobs' | 'escrows' | 'users' | 'disputes', term: string) => void;
  isLoading: boolean;
  onSearchChange?: (term: string) => void;
}

export function SearchCommandPalette({ searchTerm, onSearch, isLoading, onSearchChange }: SearchCommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleResults, setVisibleResults] = useState<{type: 'jobs' | 'escrows' | 'users' | 'disputes', term: string}[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Simulation of Command Palette Logic ---
  useEffect(() => {
    if (!isOpen) return;
    
    // In a real implementation, this would be triggered by the OS shortcut (⌘K) 
    // or focus events. Here we use input to drive the UI flow.
    if (searchTerm && !isLoading) {
        // Simulate populating results based on the current term across all categories
        const simulatedResults: {type: 'jobs' | 'escrows' | 'users' | 'disputes', term: string}[] = [
            { type: 'jobs', term: searchTerm },
            { type: 'escrows', term: searchTerm },
            { type: 'users', term: searchTerm },
            { type: 'disputes', term: searchTerm }
        ];
        setVisibleResults(simulatedResults);
    } else {
        setVisibleResults([]);
    }
  }, [isOpen, searchTerm, isLoading]);

  const handleInputFocus = () => {
      if (!isLoading) {
          setIsOpen(true);
      }
  };

  const handleSelect = (type: 'jobs' | 'escrows' | 'users' | 'disputes') => {
      // When an item is selected, perform the actual search action
      onSearch(type, searchTerm);
      setIsOpen(false); // Close palette after selection
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-10">
      {/* Search Input Area */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search Jobs, Escrows, Users, Disputes (⌘K)..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-150"
        />
        {/* Command Palette Dropdown */}
        {isOpen && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-auto">
            {visibleResults.length > 0 ? (
              visibleResults.map((result, index) => (
                <div
                  key={index}
                  className="p-3 cursor-pointer hover:bg-blue-50 transition duration-100 text-sm"
                  onClick={() => handleSelect(result.type)}
                >
                  {result.type.charAt(0).toUpperCase() + result.type.slice(1)}: {result.term}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No results found for "{searchTerm}"</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}