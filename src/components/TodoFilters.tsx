
import { TodoFilters as TodoFiltersType, TodoSort, Priority, TaskStatus } from '@/types/todo'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, ArrowUpDown, X } from 'lucide-react'

/**
 * TodoFilters component props
 */
interface TodoFiltersProps {
  /** Current filters */
  filters: TodoFiltersType
  /** Current sort configuration */
  sort: TodoSort
  /** Callback when filters change */
  onFiltersChange: (filters: TodoFiltersType) => void
  /** Callback when sort changes */
  onSortChange: (sort: TodoSort) => void
}

/**
 * TodoFilters component
 * 
 * Provides filtering and sorting controls for the todo list.
 * Includes search, status filter, priority filter, and sorting options.
 * 
 * @param filters - Current filter state
 * @param sort - Current sort configuration
 * @param onFiltersChange - Callback when filters change
 * @param onSortChange - Callback when sort changes
 */
export function TodoFilters({
  filters,
  sort,
  onFiltersChange,
  onSortChange
}: TodoFiltersProps) {
  /**
   * Handle search input change
   */
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined
    })
  }

  /**
   * Handle status filter change
   */
  const handleStatusFilter = (status: TaskStatus | undefined) => {
    onFiltersChange({
      ...filters,
      status
    })
  }

  /**
   * Handle priority filter change
   */
  const handlePriorityFilter = (priority: Priority | undefined) => {
    onFiltersChange({
      ...filters,
      priority
    })
  }

  /**
   * Handle sort field change
   */
  const handleSortChange = (field: TodoSort['field']) => {
    const newDirection = sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc'
    onSortChange({
      field,
      direction: newDirection
    })
  }

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    onFiltersChange({})
  }

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = filters.search || filters.status || filters.priority

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-navy-700" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search todos..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleStatusFilter(undefined)}
              className={`p-2 text-left rounded-md border transition-colors ${
                !filters.status
                  ? 'bg-navy-50 border-navy-200 text-navy-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter(TaskStatus.PENDING)}
              className={`p-2 text-left rounded-md border transition-colors ${
                filters.status === TaskStatus.PENDING
                  ? 'bg-navy-50 border-navy-200 text-navy-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilter(TaskStatus.COMPLETED)}
              className={`p-2 text-left rounded-md border transition-colors ${
                filters.status === TaskStatus.COMPLETED
                  ? 'bg-navy-50 border-navy-200 text-navy-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handlePriorityFilter(undefined)}
              className={`p-2 text-left rounded-md border transition-colors ${
                !filters.priority
                  ? 'bg-navy-50 border-navy-200 text-navy-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Priorities
            </button>
            <button
              onClick={() => handlePriorityFilter(Priority.HIGH)}
              className={`p-2 text-left rounded-md border transition-colors flex items-center ${
                filters.priority === Priority.HIGH
                  ? 'bg-navy-50 border-navy-200 text-navy-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              High Priority
            </button>
            <button
              onClick={() => handlePriorityFilter(Priority.MEDIUM)}
              className={`p-2 text-left rounded-md border transition-colors flex items-center ${
                filters.priority === Priority.MEDIUM
                  ? 'bg-navy-50 border-navy-200 text-navy-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              Medium Priority
            </button>
            <button
              onClick={() => handlePriorityFilter(Priority.LOW)}
              className={`p-2 text-left rounded-md border transition-colors flex items-center ${
                filters.priority === Priority.LOW
                  ? 'bg-navy-50 border-navy-200 text-navy-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Low Priority
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort By
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { field: 'createdAt' as const, label: 'Date Created' },
              { field: 'updatedAt' as const, label: 'Last Updated' },
              { field: 'title' as const, label: 'Title' },
              { field: 'priority' as const, label: 'Priority' }
            ].map((option) => (
              <button
                key={option.field}
                onClick={() => handleSortChange(option.field)}
                className={`p-2 text-left rounded-md border transition-colors flex items-center justify-between ${
                  sort.field === option.field
                    ? 'bg-navy-50 border-navy-200 text-navy-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{option.label}</span>
                {sort.field === option.field && (
                  <span className="text-xs">
                    {sort.direction === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 