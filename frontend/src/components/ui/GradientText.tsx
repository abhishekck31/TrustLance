import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function GradientText({ children, className = "", as: Tag = "span" }: GradientTextProps) {
  return (
    <Tag className={`text-gradient ${className}`}>
      {children}
    </Tag>
  );
}
