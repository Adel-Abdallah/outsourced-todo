import React from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  todoTitle: string
  isLoading?: boolean
}

export function DeleteModal({ isOpen, onClose, onConfirm, todoTitle, isLoading }: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Todo">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete "<span className="font-medium">{todoTitle}</span>"?
        </p>
        <p className="text-sm text-gray-500">
          This action cannot be undone.
        </p>
        
        <div className="flex space-x-3 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  )
} 