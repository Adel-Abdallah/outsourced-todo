import React, { useState } from 'react'
import { Todo, UpdateTodoRequest, Priority, TaskStatus } from '@/types/todo'
import { TodoForm } from '@/components/TodoForm'
import { Button } from '@/components/ui/button'
import { DeleteModal } from '@/components/ui/modal'
import { formatRelativeTime, capitalize } from '@/lib/utils'
import { 
  CheckCircle, 
  Circle, 
  Edit2, 
  Trash2, 
  Calendar,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

/**
 * TodoList component props
 */
interface TodoListProps {
  /** Array of todos to display */
  todos: Todo[]
  /** Total number of todos (before filtering) */
  totalTodos: number
  /** Current filters applied */
  hasActiveFilters: boolean
  /** Callback when todo status is toggled */
  onToggleStatus: (id: string) => Promise<void>
  /** Callback when todo is updated */
  onUpdateTodo: (todo: UpdateTodoRequest) => Promise<void>
  /** Callback when todo is deleted */
  onDeleteTodo: (id: string) => Promise<void>
}

/**
 * TodoItem component for individual todo items
 */
interface TodoItemProps {
  /** Todo item data */
  todo: Todo
  /** Callback when todo status is toggled */
  onToggleStatus: (id: string) => Promise<void>
  /** Callback when todo is updated */
  onUpdateTodo: (todo: UpdateTodoRequest) => Promise<void>
  /** Callback when todo is deleted */
  onDeleteTodo: (id: string) => Promise<void>
}

/**
 * TodoItem component
 * 
 * Displays an individual todo item with interactive controls.
 * Supports inline editing, status toggling, and deletion.
 * 
 * @param todo - Todo item data
 * @param onToggleStatus - Callback when status is toggled
 * @param onUpdateTodo - Callback when todo is updated
 * @param onDeleteTodo - Callback when todo is deleted
 */
function TodoItem({ todo, onToggleStatus, onUpdateTodo, onDeleteTodo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  /**
   * Get priority color classes
   */
  const getPriorityStyles = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return {
          badge: 'bg-red-100 text-red-800 border-red-200',
          border: 'border-l-red-500',
          dot: 'bg-red-500'
        }
      case Priority.MEDIUM:
        return {
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          border: 'border-l-yellow-500',
          dot: 'bg-yellow-500'
        }
      case Priority.LOW:
        return {
          badge: 'bg-green-100 text-green-800 border-green-200',
          border: 'border-l-green-500',
          dot: 'bg-green-500'
        }
    }
  }

  const priorityStyles = getPriorityStyles(todo.priority)

  /**
   * Handle status toggle
   */
  const handleToggleStatus = async () => {
    setIsLoading(true)
    try {
      await onToggleStatus(todo.id)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle delete
   */
  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  /**
   * Confirm delete
   */
  const handleConfirmDelete = async () => {
    setIsLoading(true)
    try {
      await onDeleteTodo(todo.id)
      setShowDeleteModal(false)
    } catch (error) {
      // Error will be handled by the context
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle edit form submission
   */
  const handleEditSubmit = () => {
    setIsEditing(false)
  }

  /**
   * Handle edit form cancellation
   */
  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const isCompleted = todo.status === TaskStatus.COMPLETED

  if (isEditing) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityStyles.border} p-6`}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Todo</h3>
        <TodoForm
          initialData={todo}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
          isEditing={true}
        />
      </div>
    )
  }

  return (
    <>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        todoTitle={todo.title}
        isLoading={isLoading}
      />
      <div className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityStyles.border} transition-all duration-200 hover:shadow-md ${
        isCompleted ? 'opacity-75' : ''
      }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Status Toggle */}
            <button
              onClick={handleToggleStatus}
              disabled={isLoading}
              className="mt-1 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 rounded"
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className={`text-lg font-medium ${
                  isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {todo.title}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityStyles.badge}`}>
                  <div className={`w-2 h-2 ${priorityStyles.dot} rounded-full mr-1`}></div>
                  {capitalize(todo.priority)}
                </span>
              </div>

              {/* Description */}
              {todo.description && (
                <div className="mb-3">
                  {todo.description.length > 100 && !isExpanded ? (
                    <div>
                      <p className={`text-sm ${
                        isCompleted ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {todo.description.substring(0, 100)}...
                      </p>
                      <button
                        onClick={() => setIsExpanded(true)}
                        className="text-sm text-navy-600 hover:text-navy-700 mt-1 flex items-center"
                      >
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show more
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className={`text-sm ${
                        isCompleted ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {todo.description}
                      </p>
                      {todo.description.length > 100 && (
                        <button
                          onClick={() => setIsExpanded(false)}
                          className="text-sm text-navy-600 hover:text-navy-700 mt-1 flex items-center"
                        >
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Show less
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Created {formatRelativeTime(todo.createdAt)}</span>
                </div>
                {todo.completedAt && (
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>Completed {formatRelativeTime(todo.completedAt)}</span>
                  </div>
                )}
                {!isCompleted && todo.updatedAt > todo.createdAt && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Updated {formatRelativeTime(todo.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

/**
 * TodoList component
 * 
 * Displays a list of todo items with proper organization and visual feedback.
 * Groups todos by priority and provides a clean, scannable interface.
 * 
 * @param todos - Array of todos to display
 * @param totalTodos - Total number of todos (before filtering)
 * @param hasActiveFilters - Whether any filters are currently active
 * @param onToggleStatus - Callback when todo status is toggled
 * @param onUpdateTodo - Callback when todo is updated
 * @param onDeleteTodo - Callback when todo is deleted
 */
export function TodoList({ todos, totalTodos, hasActiveFilters, onToggleStatus, onUpdateTodo, onDeleteTodo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        {hasActiveFilters ? (
          <p className="text-gray-600">No todos found matching your filters.</p>
        ) : (
          <p className="text-gray-600">
            {totalTodos === 0 ? "No todos yet. Add your first todo to get started!" : "All todos are hidden by current filters."}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleStatus={onToggleStatus}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </div>
  )
} 