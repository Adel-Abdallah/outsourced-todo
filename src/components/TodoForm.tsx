import React, { useState, useEffect } from 'react'
import { Priority, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo'
import { useTodo } from '@/contexts/TodoContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { isValidString } from '@/lib/utils'

/**
 * TodoForm component props
 */
interface TodoFormProps {
  /** Existing todo data for editing */
  initialData?: UpdateTodoRequest
  /** Form submission handler */
  onSubmit?: () => void
  /** Form cancellation handler */
  onCancel?: () => void
  /** Whether the form is in edit mode */
  isEditing?: boolean
}

/**
 * Form data interface
 */
interface FormData {
  title: string
  description: string
  priority: Priority
}

/**
 * TodoForm component
 * 
 * Handles creation and editing of todo items with validation.
 * Provides a clean form interface with proper error handling.
 * 
 * @param initialData - Initial form data for editing
 * @param onSubmit - Callback when form is successfully submitted
 * @param onCancel - Callback when form is cancelled
 * @param isEditing - Whether the form is in edit mode
 */
export function TodoForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}: TodoFormProps) {
  const { actions } = useTodo()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Initialize form data with existing todo data
   */
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || Priority.MEDIUM,
      })
    }
  }, [initialData])

  /**
   * Validate form data
   * 
   * @param data Form data to validate
   * @returns Object containing validation errors
   */
  const validateForm = (data: FormData): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!isValidString(data.title)) {
      errors.title = 'Title is required'
    } else if (data.title.length > 255) {
      errors.title = 'Title must be less than 255 characters'
    }

    if (data.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters'
    }

    if (!Object.values(Priority).includes(data.priority)) {
      errors.priority = 'Please select a valid priority'
    }

    return errors
  }

  /**
   * Handle form field changes
   * 
   * @param field Field name
   * @param value Field value
   */
  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for the field being updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  /**
   * Handle form submission
   * 
   * @param e Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      if (isEditing && initialData?.id) {
        // Update existing todo
        await actions.updateTodo({
          id: initialData.id,
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
        })
      } else {
        // Create new todo
        const newTodo: CreateTodoRequest = {
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
        }
        await actions.createTodo(newTodo)
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: Priority.MEDIUM,
      })
      
      onSubmit?.()
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save todo',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: Priority.MEDIUM,
    })
    setErrors({})
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="Enter todo title..."
          hasError={!!errors.title}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Enter todo description (optional)..."
          rows={3}
          hasError={!!errors.description}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Priority Field */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) => handleFieldChange('priority', e.target.value as Priority)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          <option value={Priority.HIGH}>High Priority</option>
          <option value={Priority.MEDIUM}>Medium Priority</option>
          <option value={Priority.LOW}>Low Priority</option>
        </select>
        {errors.priority && (
          <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditing ? 'Update Todo' : 'Add Todo'}
        </Button>
      </div>
    </form>
  )
} 