import React, { createContext, useContext, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

/**
 * Toast types
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning'

/**
 * Toast interface
 */
interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

/**
 * Toast context interface
 */
interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

/**
 * Toast context
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * Toast provider component
 * 
 * @param children Child components
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto-remove toast after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

/**
 * Use toast hook
 * 
 * @returns Toast context
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/**
 * Toast component
 * 
 * @param toast Toast data
 * @param onClose Close handler
 */
export function ToastComponent({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const baseStyles = 'relative p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 ease-in-out'
  
  const typeStyles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
  }

  const iconStyles = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div className={cn(baseStyles, typeStyles[toast.type])}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <span className="text-lg font-semibold">
            {iconStyles[toast.type]}
          </span>
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{toast.title}</h4>
          {toast.message && (
            <p className="mt-1 text-sm opacity-90">{toast.message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-3 text-lg font-bold opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  )
}

/**
 * Toaster component
 * 
 * Renders all active toasts
 */
export function Toaster() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map(toast => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

/**
 * Simple toast function for easy usage
 */
export function toast(
  type: ToastType,
  title: string,
  message?: string,
  duration?: number
) {
  // This is a simplified version - in a real app, you'd use the context
  console.log(`Toast ${type}: ${title}${message ? ` - ${message}` : ''}${duration ? ` (${duration}ms)` : ''}`)
} 