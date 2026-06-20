// Main page demonstrating the integration of the skeleton loading system.
import SkeletonLoader from '@/components/SkeletonLoader'
import React from 'react'

// Mock data fetching function simulating an async load delay
const fetchMockData = (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ items: [{ id: 1, title: "TrustLance Contract A" }, { id: 2, title: "TrustLance Contract B" }] });
    }, 2000) // Simulate 2 seconds loading time
  })
}

export default async function HomePage() {
  // In a real app, this would be inside a Server Component or handled via state in Client Components.
  // For demonstration in the App Router context (which often uses async/await), we simulate the wait effect if possible, 
  // but since skeleton loading is usually client-side based on API calls, we handle the structure here.

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">TrustLance Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">Web3 Application Skeleton Loading Demo</p>
      </header>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contract Listings</h2>

        {/* Skeleton Loading Section */}
        <div className="mb-10 border border-dashed p-4 rounded-md bg-gray-50">
          <h3 className="text-xl font-medium mb-4 text-gray-700">Recent Transactions</h3>
          <SkeletonLoader className="mb-6" />
        </div>

        {/* Actual Content Placeholder (or loading state simulation) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Account Overview</h2>
          <SkeletonLoader className="w-full" />
          <SkeletonLoader className="w-full" />

          <h2 className="text-2xl font-semibold text-gray-800 pt-6">Recent Activities</h2>
          <SkeletonLoader className="w-full" />
          <SkeletonLoader className="w-full" />
        </div>
      </div>

      {/* Optional: A real loading state trigger (if this were a Client Component fetching data) */}
      {/* 
      <div className="mt-10 text-center">
        <button onClick={fetchMockData}>Start Real Load (Simulated)</button>
      </div> 
      */}
    </div>
  )
}