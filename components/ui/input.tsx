import React from 'react'

type InputType = 'text' | 'password' | 'email' | 'number' | 'textarea'
type InputVariant = 'default' | 'bordered' | 'full'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputType
  variant?: InputVariant
  label?: string
  className?: string
  ...props
}

const baseStyles = "flex h-10 w-full rounded-md border bg-white text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all"

const variantStyles = {
  default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
  bordered: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
  full: "border-blue-500 focus:border-blue-500 focus:ring-blue-500",
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  variant = 'default',
  label,
  className = '',
  ...props
}) => {
  const variantClass = variantStyles[variant] || variantStyles.default

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={props.id}
        type={type}
        className={`${baseStyles} ${variantClass} ${props.className}`}
        {...props}
      />
    </div>
  )
}