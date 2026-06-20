// Reusable component for creating skeleton loading UI elements.
import React from 'react'

interface SkeletonProps {
  className?: string
  duration?: number // Not strictly needed for static skeleton, but good practice if we were doing shimmer animation
}

const SkeletonLoader: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Placeholder for a typical card/item */}
      <div className="h-6 bg-gray-200 rounded mb-4 w-full"></div>
      {/* Placeholder for text/title */}
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      {/* Placeholder for a larger block (e.g., image or main content) */}
      <div className="h-48 bg-gray-200 rounded mb-6 w-full"></div>
    </div>
  )
}

export default SkeletonLoader