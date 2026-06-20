import React from 'react';

interface SpinnerProps {
  message: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => (
  <div className="flex justify-center items-center p-10 bg-white rounded-lg shadow">
    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
    <p className="ml-3 text-lg font-medium text-blue-600">{message}</p>
  </div>
);

export default Spinner;