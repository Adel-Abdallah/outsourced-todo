import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input component props
 */
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Whether the input has an error */
  hasError?: boolean
  /** Input size */
  size?: 'sm' | 'md' | 'lg'
  /** Whether the input is full width */
  fullWidth?: boolean
}

/**
 * Input component
 * 
 * A reusable input component with consistent styling and error states.
 * 
 * @param hasError - Whether the input has an error state
 * @param size - The input size ('sm', 'md', 'lg')
 * @param fullWidth - Whether the input should take full width
 * @param className - Additional CSS classes
 * @param props - Additional input props
 */
export const Input: React.FC<InputProps> = ({
  hasError = false,
  size = 'md',
  fullWidth = true,
  className,
  ...props
}) => {
  const baseStyles = 'border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }
  
  const stateStyles = hasError
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-navy-500 focus:ring-navy-500'
  
  const widthStyles = fullWidth ? 'w-full' : ''
  
  return (
    <input
      className={cn(
        baseStyles,
        sizeStyles[size],
        stateStyles,
        widthStyles,
        className
      )}
      {...props}
    />
  )
}

/**
 * Textarea component props
 */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Whether the textarea has an error */
  hasError?: boolean
  /** Whether the textarea is full width */
  fullWidth?: boolean
}

/**
 * Textarea component
 * 
 * A reusable textarea component with consistent styling and error states.
 * 
 * @param hasError - Whether the textarea has an error state
 * @param fullWidth - Whether the textarea should take full width
 * @param className - Additional CSS classes
 * @param props - Additional textarea props
 */
export const Textarea: React.FC<TextareaProps> = ({
  hasError = false,
  fullWidth = true,
  className,
  ...props
}) => {
  const baseStyles = 'border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 text-sm resize-y'
  
  const stateStyles = hasError
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-navy-500 focus:ring-navy-500'
  
  const widthStyles = fullWidth ? 'w-full' : ''
  
  return (
    <textarea
      className={cn(
        baseStyles,
        stateStyles,
        widthStyles,
        className
      )}
      {...props}
    />
  )
} 