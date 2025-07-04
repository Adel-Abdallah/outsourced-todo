import React, { useEffect } from 'react'
import { Plus, ListTodo } from 'lucide-react'
import { useTodo } from '@/contexts/TodoContext'
import { TodoList } from '@/components/TodoList'
import { TodoForm } from '@/components/TodoForm'
import { TodoStats } from '@/components/TodoStats'
import { TodoFilters } from '@/components/TodoFilters'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { CollapsiblePanel } from '@/components/ui/CollapsiblePanel'

/**
 * TodoApp component
 * 
 * Main container component for the todo application.
 * Handles the overall layout and coordinates between different components.
 */
export function TodoApp() {
  const { state, actions } = useTodo()
  const { addToast } = useToast()
  const [showAddForm, setShowAddForm] = React.useState(false)

  /**
   * Load todos when component mounts
   */
  useEffect(() => {
    const loadInitialTodos = async () => {
      try {
        await actions.loadTodos()
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Failed to load todos',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        })
      }
    }

    loadInitialTodos()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Handle adding a new todo
   */
  const handleAddTodo = () => {
    setShowAddForm(true)
  }

  /**
   * Handle form submission
   */
  const handleFormSubmit = () => {
    setShowAddForm(false)
  }

  /**
   * Handle form cancellation
   */
  const handleFormCancel = () => {
    setShowAddForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ListTodo className="h-8 w-8 text-navy-700 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Todo App
              </h1>
            </div>
            <Button
              onClick={handleAddTodo}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Todo</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Stats and Filters */}
          <div className="lg:col-span-1 space-y-6">
            <CollapsiblePanel title="Statistics">
              <TodoStats stats={state.stats} />
            </CollapsiblePanel>
            <CollapsiblePanel title="Filters">
              <TodoFilters
                filters={state.filters}
                sort={state.sort}
                onFiltersChange={actions.setFilters}
                onSortChange={actions.setSort}
              />
            </CollapsiblePanel>
          </div>

          {/* Right Column - Todo List */}
          <div className="lg:col-span-3">
            {/* Add Todo Form */}
            {showAddForm && (
              <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Add New Todo
                </h2>
                <TodoForm
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              </div>
            )}

            {/* Error State */}
            {state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error occurred
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {state.error}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={actions.clearError}
                      className="text-red-800 hover:text-red-900"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {state.isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy-700"></div>
                  <span className="text-gray-600">Loading todos...</span>
                </div>
              </div>
            )}

            {/* Todo List - Only show when todos exist (even if filtered out) */}
            {!state.isLoading && state.allTodos.length > 0 && (
              <TodoList
                todos={state.todos}
                totalTodos={state.allTodos.length}
                hasActiveFilters={!!(state.filters.search || state.filters.status || state.filters.priority)}
                onToggleStatus={actions.toggleTodoStatus}
                onUpdateTodo={actions.updateTodo}
                onDeleteTodo={actions.deleteTodo}
              />
            )}

            {/* Empty State - Only show when NO todos exist at all */}
            {!state.isLoading && state.allTodos.length === 0 && !state.error && (
              <div className="text-center py-12">
                <ListTodo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No todos yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by adding your first todo item.
                </p>
                {!showAddForm && (
                  <Button onClick={handleAddTodo}>
                    Add Your First Todo
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 