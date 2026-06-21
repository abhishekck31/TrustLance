// Component for copy feedback animation (toast effect).
import React from 'react';

interface CopyFeedbackToastProps {
  isVisible: boolean;
}

export const CopyFeedbackToast: React.FC<CopyFeedbackToastProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-xl transition-all duration-500 transform translate-x-0 opacity-100 animate-fadeIn">
      Copied to clipboard!
    </div>
  );
};