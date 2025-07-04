import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Button component variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'

/**
 * Button component sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Button component props
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** Whether the button is loading */
  isLoading?: boolean
  /** Whether the button is full width */
  fullWidth?: boolean
  /** Button children */
  children: React.ReactNode
}

/**
 * Button component
 * 
 * A reusable button component with multiple variants and sizes.
 * Supports loading state and full width styling.
 * 
 * @param variant - The button variant ('primary', 'secondary', 'danger', 'outline', 'ghost')
 * @param size - The button size ('sm', 'md', 'lg')
 * @param isLoading - Whether the button is in loading state
 * @param fullWidth - Whether the button should take full width
 * @param children - Button content
 * @param className - Additional CSS classes
 * @param disabled - Whether the button is disabled
 * @param props - Additional button props
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantStyles = {
    primary: 'bg-navy-700 text-white hover:bg-navy-800 focus:ring-navy-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-navy-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
  }
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg',
  }
  
  const widthStyles = fullWidth ? 'w-full' : ''
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyles,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
} 