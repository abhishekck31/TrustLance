import React from 'react'

interface BadgeProps {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  className?: string
  children: React.ReactNode
}

const variantStyles = {
  default: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-medium",
  success: "bg-green-100 text-green-800 border-green-300",
  error: "bg-red-100 text-red-800 border-red-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  info: "bg-blue-100 text-blue-800 border-blue-300",
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const variantClass = variantStyles[variant] || variantStyles.default

  return (
    <span className={`inline-flex items-center rounded-full border ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  )
}