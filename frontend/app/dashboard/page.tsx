// Skeleton Loader for Dashboard view
import { Skeleton } from '@/components/ui/skeleton'; // Assuming a custom component exists, otherwise use simple divs styled with Tailwind
import React from 'react';

const DashboardSkeleton = () => (
  <div className="space-y-6 p-4">
    <h1 className="text-2xl font-bold border-b pb-2">Dashboard Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-48 w-full rounded-lg bg-gray-100" />
      <Skeleton className="h-48 w-full rounded-lg bg-gray-100" />
      <Skeleton className="h-48 w-full rounded-lg bg-gray-100" />
    </div>
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

export default DashboardSkeleton;


[FILE: frontend/app/jobs/[jobId]/page.tsx]
// Skeleton Loader for a specific Job detail view
import { Skeleton } from '@/components/ui/skeleton'; // Assuming a custom component exists
import React from 'react';

const JobDetailSkeleton = () => (
  <div className="space-y-6 p-4">
    <h1 className="text-3xl font-bold border-b pb-2">Job Details</h1>
    
    {/* Job Status Card */}
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Job Information</h2>
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>

    {/* Job History/Tasks */}
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Job History</h2>
      <Skeleton className="h-32 w-full mb-6" />
      <Skeleton className="h-32 w-full" />
    </div>

    {/* Related Data */}
     <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Related Analytics</h2>
      <Skeleton className="h-32 w-full mb-6" />
      <Skeleton className="h-40 w-full" />
    </div>

  </div>
);

export default JobDetailSkeleton;


[FILE: frontend/components/ui/skeleton.tsx]
// Reusable Skeleton component definition
import React from 'react';

interface SkeletonProps {
  className?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className || ''}`} />
  );
};

export { Skeleton };


[FILE: frontend/app/page.tsx]
// Example usage demonstration in the main page
import DashboardSkeleton from './dashboard/page';
import JobDetailSkeleton from './jobs/[jobId]/page'; // Assuming this is where job details live

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">TrustLance Web3 Platform</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your jobs, analytics, and blockchain data.</p>
      </header>

      {/* Example of Dashboard Skeleton */}
      <div className="my-12">
        <DashboardSkeleton />
      </div>

      {/* Example of Job Detail Skeleton */}
      <div className="my-12">
        <JobDetailSkeleton />
      </div>
    </div>
  );
}