import { ReactNode } from "react";

export type EscrowStatus = "Pending" | "Open" | "Funded" | "InProgress" | "Disputed" | "Completed";

interface StatusBadgeProps {
  status: EscrowStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const styles: Record<EscrowStatus, string> = {
    Pending: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    Open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Funded: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    InProgress: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Disputed: "bg-red-500/10 text-red-400 border-red-500/20",
    Completed: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]} ${className}`}>
      {status}
    </span>
  );
}
