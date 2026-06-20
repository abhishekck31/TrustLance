// Creating a reusable, interaction-aware button component using Tailwind CSS for micro-interactions.
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional class overrides for specific styles */
  className?: string;
  /** State control for loading/disabled states */
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  isLoading = false,
  children,
  disabled,
  ...props
}) => {
  // Base interaction classes defining the feel of the button
  const baseClasses =
    "font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-in-out shadow-md focus:outline-none focus:ring-4";

  // Dynamic class manipulation based on state
  let finalClasses = baseClasses;

  if (isLoading) {
    finalClasses += " bg-gray-400 cursor-wait animate-pulse";
  } else if (disabled) {
    finalClasses += " bg-gray-200 text-gray-500 cursor-not-allowed shadow-none";
  } else {
    // Default interactive states for hover and focus
    finalClasses += " bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 focus:ring-offset-2";
  }

  return (
    <button
      className={`${finalClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Processing..." : children}
    </button>
  );
};

export { Button };