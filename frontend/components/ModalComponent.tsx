// Generic component demonstrating Glassmorphism for modals.
import React from 'react';

interface ModalComponentProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function ModalComponent({ title, onClose, children }: ModalComponentProps) {
  return (
    <>
      {/* Overlay: Dark semi-transparent background */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        {/* Modal Container (Glassmorphism) */}
        <div 
          className="w-full max-w-xl rounded-xl shadow-2xl 
                     bg-white/18 backdrop-blur-lg border border-white/40 p-8 animate-fadeIn"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div className="flex justify-between items-center pb-4 border-b border-gray-300">
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}