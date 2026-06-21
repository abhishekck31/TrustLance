import { Lock, DollarSign, ArrowRight } from 'lucide-react';

export function EscrowsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl shadow-inner border border-dashed border-gray-300 transition duration-300 hover:border-green-400">
      {/* Illustration Placeholder */}
      <div className="p-6 mb-8 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
        <Lock className="w-10 h-10 text-green-600" />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4">No Escrow Activities</h2>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-8 max-w-md text-center">
        There are no ongoing escrow agreements to view. Start a secure transaction or manage your escrow services today.
      </p>

      {/* CTA */}
      <a
        href="/escrows/new"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out transform hover:scale-[1.02]"
      >
        Create New Escrow
        <ArrowRight className="ml-2 h-5 w-5" />
      </a>
    </div>
  );
}