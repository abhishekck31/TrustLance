import { Zap, Briefcase, ArrowRight } from 'lucide-react';

export function JobsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl shadow-inner border border-dashed border-gray-300 transition duration-300 hover:border-indigo-400">
      {/* Illustration Placeholder */}
      <div className="p-6 mb-8 bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
        <Zap className="w-10 h-10 text-indigo-600" />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">No Jobs Found</h2>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-8 max-w-md text-center">
        It looks like there are no active jobs currently listed. Start posting your skills or explore new opportunities to connect with our community.
      </p>

      {/* CTA */}
      <a
        href="/jobs/create"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out transform hover:scale-[1.02]"
      >
        Post a New Job
        <ArrowRight className="ml-2 h-5 w-5" />
      </a>
    </div>
  );
}