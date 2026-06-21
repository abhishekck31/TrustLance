import { AlertTriangle, Gavel, ArrowRight } from 'lucide-react';

export function DisputesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl shadow-inner border border-dashed border-gray-300 transition duration-300 hover:border-red-400">
      {/* Illustration Placeholder */}
      <div className="p-6 mb-8 bg-red-100 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
        <Gavel className="w-10 h-10 text-red-600" />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">No Disputes Open</h2>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-8 max-w-md text-center">
        There are no active disputes requiring attention. If you need to file a claim or resolve an issue, please use the guide below.
      </p>

      {/* CTA */}
      <a
        href="/disputes/file"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 transition duration-150 ease-in-out transform hover:scale-[1.02]"
      >
        File a New Dispute
        <ArrowRight className="ml-2 h-5 w-5" />
      </a>
    </div>
  );
}