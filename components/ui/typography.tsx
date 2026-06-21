import React from 'react'

type TypographyVariant = 'base' | 'sm' | 'lg' | 'heading'

interface TypographyProps {
  variant?: TypographyVariant
  className?: string
  children: React.ReactNode
}

const variantStyles = {
  base: "text-base",
  sm: "text-sm",
  lg: "text-lg",
  heading: "text-xl font-bold", // Example of a heading variant
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'base',
  className = '',
  children,
  ...props
}) => {
  const variantClass = variantStyles[variant] || variantStyles.base

  return (
    <div className={`font-sans ${variantClass} ${className}`}>
      {children}
    </div>
  )
}