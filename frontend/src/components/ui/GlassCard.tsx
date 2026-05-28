import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className = "", hoverEffect = false }: GlassCardProps) {
  return (
    <div className={`
      ${hoverEffect ? 'glass-card' : 'glass-panel rounded-2xl'}
      p-6 relative overflow-hidden
      ${className}
    `}>
      {children}
    </div>
  );
}
