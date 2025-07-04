import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * This function combines clsx and tailwind-merge to handle class conflicts
 * @param inputs - Array of class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a unique identifier string
 * Uses timestamp and random number for uniqueness
 * @returns Unique identifier string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Formats a date to a human-readable string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
}

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Debounces a function call
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Validates that a string is not empty or only whitespace
 * @param value - String to validate
 * @returns True if valid, false otherwise
 */
export function isValidString(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Safely parses a JSON string
 * @param value - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeParseJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

/**
 * Creates a toast notification object
 * @param message - Toast message
 * @param type - Toast type
 * @returns Toast notification object
 */
export function createToast(
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info'
) {
  return {
    id: generateId(),
    message,
    type,
    timestamp: new Date(),
  }
} 