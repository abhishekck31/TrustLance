import { JobsEmptyState } from './jobs-empty';
import { EscrowsEmptyState } from './escrows-empty';
import { GovernanceEmptyState } from './governance-empty';
import { DisputesEmptyState } from './disputes-empty';

export function EmptyStatesContainer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
      <JobsEmptyState />
      <EscrowsEmptyState />
      <GovernanceEmptyState />
      <DisputesEmptyState />
    </div>
  );
}