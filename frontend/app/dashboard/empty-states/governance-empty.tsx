import { Shield, Scale, ArrowRight } from 'lucide-react';

export function GovernanceEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl shadow-inner border border-dashed border-gray-300 transition duration-300 hover:border-yellow-400">
      {/* Illustration Placeholder */}
      <div className="p-6 mb-8 bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
        <Scale className="w-10 h-10 text-yellow-600" />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">No Governance Actions</h2>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-8 max-w-md text-center">
        No recent governance proposals or votes are currently available. Participate in the community decisions and shape the future of TrustLance.
      </p>

      {/* CTA */}
      <a
        href="/governance/proposals"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 transition duration-150 ease-in-out transform hover:scale-[1.02]"
      >
        View Proposals
        <ArrowRight className="ml-2 h-5 w-5" />
      </a>
    </div>
  );
}