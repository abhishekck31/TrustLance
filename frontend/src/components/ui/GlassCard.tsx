import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  style?: CSSProperties;
}

export function GlassCard({ children, className = "", hoverEffect = false, style }: GlassCardProps) {
  return (
    <div 
      className={`
      ${hoverEffect ? 'glass-card' : 'glass-panel rounded-2xl'}
      p-6 relative overflow-hidden
      ${className}
    `}
      style={style}
    >
      {children}
    </div>
  );
}
