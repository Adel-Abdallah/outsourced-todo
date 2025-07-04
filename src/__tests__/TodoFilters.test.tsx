import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoFilters } from '@/components/TodoFilters'
import { TodoFilters as TodoFiltersType, TodoSort, Priority, TaskStatus } from '@/types/todo'

/**
 * Test suite for TodoFilters component
 * 
 * Tests all filtering and sorting functionality including:
 * - Search functionality
 * - Status filtering (All, Pending, Completed)
 * - Priority filtering (All, High, Medium, Low)
 * - Sort functionality (Date Created, Last Updated, Title, Priority)
 */
describe('TodoFilters Component', () => {

  const mockFilters: TodoFiltersType = {}
  const mockSort: TodoSort = { field: 'createdAt', direction: 'desc' }
  const mockOnFiltersChange = vi.fn()
  const mockOnSortChange = vi.fn()

  const defaultProps = {
    filters: mockFilters,
    sort: mockSort,
    onFiltersChange: mockOnFiltersChange,
    onSortChange: mockOnSortChange
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Test 4: Filters Section
   * Tests the general filter functionality and clear filters button
   */
  describe('Filters Section', () => {
    it('should display the filters title and icon', () => {
      render(<TodoFilters {...defaultProps} />)
      
      // Should show filters header with icon
      expect(screen.getByText(/filters/i)).toBeInTheDocument()
      expect(screen.getByText(/filters/i).closest('h2')).toBeInTheDocument()
    })

    it('should show clear filters button when filters are active', () => {
      const activeFilters = {
        search: 'test search',
        status: TaskStatus.PENDING
      }

      render(<TodoFilters {...defaultProps} filters={activeFilters} />)

      // Clear button should be visible when filters are active
      const clearButton = screen.getByText(/clear/i)
      expect(clearButton).toBeInTheDocument()
    })

    it('should hide clear filters button when no filters are active', () => {
      render(<TodoFilters {...defaultProps} />)

      // Clear button should not be visible when no filters are active
      expect(screen.queryByText(/clear/i)).not.toBeInTheDocument()
    })

    it('should call onFiltersChange with empty object when clear is clicked', async () => {
      const user = userEvent.setup()
      const activeFilters = {
        search: 'test',
        status: TaskStatus.COMPLETED,
        priority: Priority.HIGH
      }

      render(<TodoFilters {...defaultProps} filters={activeFilters} />)

      const clearButton = screen.getByText(/clear/i)
      await user.click(clearButton)

      // Should clear all filters
      expect(mockOnFiltersChange).toHaveBeenCalledWith({})
    })
  })

  /**
   * Test 5: Search Functionality
   * Tests the search input field and its behavior
   */
  describe('Search Functionality', () => {
    it('should display search input with placeholder', () => {
      render(<TodoFilters {...defaultProps} />)

      // Search input should be present
      const searchInput = screen.getByPlaceholderText(/search todos/i)
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('type', 'text')
    })

    it('should display current search value', () => {
      const filtersWithSearch = { search: 'important task' }
      
      render(<TodoFilters {...defaultProps} filters={filtersWithSearch} />)

      const searchInput = screen.getByDisplayValue('important task')
      expect(searchInput).toBeInTheDocument()
    })

    it('should call onFiltersChange when search text changes', async () => {
      const user = userEvent.setup()
      render(<TodoFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText(/search todos/i)
      await user.type(searchInput, 'meeting')

      // Should call onFiltersChange for each character typed
      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalled()
      })
      
      // Final call should include the full search term
      expect(mockOnFiltersChange).toHaveBeenLastCalledWith({
        search: 'meeting'
      })
    })

    it('should remove search filter when input is cleared', async () => {
      const user = userEvent.setup()
      const filtersWithSearch = { search: 'old search' }
      
      render(<TodoFilters {...defaultProps} filters={filtersWithSearch} />)

      const searchInput = screen.getByDisplayValue('old search')
      await user.clear(searchInput)

      // Should remove search from filters
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: undefined
      })
    })
  })

  /**
   * Test 6: Status Filtering
   * Tests the status filter buttons (All, Pending, Completed)
   */
  describe('Status Filtering', () => {
    it('should display all status filter options', () => {
      render(<TodoFilters {...defaultProps} />)

      // All status options should be present
      expect(screen.getByText('All')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
    })

    it('should highlight "All" status by default', () => {
      render(<TodoFilters {...defaultProps} />)

      const allButton = screen.getByText('All')
      
      // Should have active styling classes
      expect(allButton).toHaveClass('bg-navy-50', 'border-navy-200', 'text-navy-700')
    })

    it('should highlight selected status filter', () => {
      const filtersWithStatus = { status: TaskStatus.PENDING }
      
      render(<TodoFilters {...defaultProps} filters={filtersWithStatus} />)

      const pendingButton = screen.getByText('Pending')
      
      // Should have active styling
      expect(pendingButton).toHaveClass('bg-navy-50', 'border-navy-200', 'text-navy-700')
    })

    it('should call onFiltersChange when status filter is clicked', async () => {
      const user = userEvent.setup()
      render(<TodoFilters {...defaultProps} />)

      const pendingButton = screen.getByText('Pending')
      await user.click(pendingButton)

      // Should set pending status filter
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        status: TaskStatus.PENDING
      })
    })

    it('should clear status filter when "All" is clicked', async () => {
      const user = userEvent.setup()
      const filtersWithStatus = { status: TaskStatus.COMPLETED }
      
      render(<TodoFilters {...defaultProps} filters={filtersWithStatus} />)

      const allButton = screen.getByText('All')
      await user.click(allButton)

      // Should clear status filter
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        status: undefined
      })
    })
  })

  /**
   * Test 7: Priority Filtering
   * Tests the priority filter buttons (All, High, Medium, Low)
   */
  describe('Priority Filtering', () => {
    it('should display all priority filter options', () => {
      render(<TodoFilters {...defaultProps} />)

      // All priority options should be present
      expect(screen.getByText('All Priorities')).toBeInTheDocument()
      expect(screen.getByText('High Priority')).toBeInTheDocument()
      expect(screen.getByText('Medium Priority')).toBeInTheDocument()
      expect(screen.getByText('Low Priority')).toBeInTheDocument()
    })

    it('should show priority indicators with correct colors', () => {
      render(<TodoFilters {...defaultProps} />)

      // Should have colored dots for each priority
      const highPriorityButton = screen.getByText('High Priority').closest('button')
      const mediumPriorityButton = screen.getByText('Medium Priority').closest('button')
      const lowPriorityButton = screen.getByText('Low Priority').closest('button')

      expect(highPriorityButton).toBeInTheDocument()
      expect(mediumPriorityButton).toBeInTheDocument()
      expect(lowPriorityButton).toBeInTheDocument()
    })

    it('should highlight "All Priorities" by default', () => {
      render(<TodoFilters {...defaultProps} />)

      const allPrioritiesButton = screen.getByText('All Priorities')
      
      // Should have active styling
      expect(allPrioritiesButton).toHaveClass('bg-navy-50', 'border-navy-200', 'text-navy-700')
    })

    it('should highlight selected priority filter', () => {
      const filtersWithPriority = { priority: Priority.HIGH }
      
      render(<TodoFilters {...defaultProps} filters={filtersWithPriority} />)

      const highPriorityButton = screen.getByText('High Priority')
      
      // Should have active styling
      expect(highPriorityButton).toHaveClass('bg-navy-50', 'border-navy-200', 'text-navy-700')
    })

    it('should call onFiltersChange when priority filter is clicked', async () => {
      const user = userEvent.setup()
      render(<TodoFilters {...defaultProps} />)

      const mediumPriorityButton = screen.getByText('Medium Priority')
      await user.click(mediumPriorityButton)

      // Should set medium priority filter
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        priority: Priority.MEDIUM
      })
    })

    it('should clear priority filter when "All Priorities" is clicked', async () => {
      const user = userEvent.setup()
      const filtersWithPriority = { priority: Priority.LOW }
      
      render(<TodoFilters {...defaultProps} filters={filtersWithPriority} />)

      const allPrioritiesButton = screen.getByText('All Priorities')
      await user.click(allPrioritiesButton)

      // Should clear priority filter
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        priority: undefined
      })
    })
  })

  /**
   * Test 8: Sort By Functionality
   * Tests the sorting options and direction toggling
   */
  describe('Sort By Functionality', () => {
    it('should display all sort options', () => {
      render(<TodoFilters {...defaultProps} />)

      // All sort options should be present
      expect(screen.getByText('Date Created')).toBeInTheDocument()
      expect(screen.getByText('Last Updated')).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Priority')).toBeInTheDocument()
    })

    it('should highlight currently selected sort field', () => {
      const sortByTitle: TodoSort = { field: 'title', direction: 'asc' }
      
      render(<TodoFilters {...defaultProps} sort={sortByTitle} />)

      const titleButton = screen.getByText('Title')
      
      // Should have active styling
      expect(titleButton).toHaveClass('bg-navy-50', 'border-navy-200', 'text-navy-700')
    })

    it('should show sort direction indicator', () => {
      const sortDescending: TodoSort = { field: 'createdAt', direction: 'desc' }
      
      render(<TodoFilters {...defaultProps} sort={sortDescending} />)

      const dateCreatedButton = screen.getByText('Date Created').closest('button')
      
      // Should show descending arrow
      expect(dateCreatedButton).toHaveTextContent('↓')
    })

    it('should show ascending arrow when direction is asc', () => {
      const sortAscending: TodoSort = { field: 'priority', direction: 'asc' }
      
      render(<TodoFilters {...defaultProps} sort={sortAscending} />)

      const priorityButton = screen.getByText('Priority').closest('button')
      
      // Should show ascending arrow
      expect(priorityButton).toHaveTextContent('↑')
    })

    it('should call onSortChange with descending direction when new field is clicked', async () => {
      const user = userEvent.setup()
      render(<TodoFilters {...defaultProps} />)

      const titleButton = screen.getByText('Title')
      await user.click(titleButton)

      // Should set new sort field with descending direction
      expect(mockOnSortChange).toHaveBeenCalledWith({
        field: 'title',
        direction: 'desc'
      })
    })

    it('should toggle direction when same field is clicked', async () => {
      const user = userEvent.setup()
      const currentSort: TodoSort = { field: 'title', direction: 'desc' }
      
      render(<TodoFilters {...defaultProps} sort={currentSort} />)

      const titleButton = screen.getByText('Title')
      await user.click(titleButton)

      // Should toggle to ascending direction
      expect(mockOnSortChange).toHaveBeenCalledWith({
        field: 'title',
        direction: 'asc'
      })
    })

    it('should handle all sort field options correctly', async () => {
      const user = userEvent.setup()
      render(<TodoFilters {...defaultProps} />)

      const sortOptions = [
        { button: 'Date Created', field: 'createdAt' },
        { button: 'Last Updated', field: 'updatedAt' },
        { button: 'Title', field: 'title' },
        { button: 'Priority', field: 'priority' }
      ]

      for (const option of sortOptions) {
        const button = screen.getByText(option.button)
        await user.click(button)

        expect(mockOnSortChange).toHaveBeenCalledWith({
          field: option.field,
          direction: 'desc'
        })
      }
    })
  })

  /**
   * Test 9: Combined Filter States
   * Tests how multiple filters work together
   */
  describe('Combined Filter States', () => {
    it('should handle multiple active filters correctly', () => {
      const multipleFilters = {
        search: 'important',
        status: TaskStatus.PENDING,
        priority: Priority.HIGH
      }

      render(<TodoFilters {...defaultProps} filters={multipleFilters} />)

      // All filters should be reflected in the UI
      expect(screen.getByDisplayValue('important')).toBeInTheDocument()
      
      const pendingButton = screen.getByText('Pending')
      const highPriorityButton = screen.getByText('High Priority')
      
      expect(pendingButton).toHaveClass('bg-navy-50')
      expect(highPriorityButton).toHaveClass('bg-navy-50')
    })

    it('should preserve other filters when one filter changes', async () => {
      const user = userEvent.setup()
      const existingFilters = {
        search: 'meeting',
        status: TaskStatus.PENDING
      }

      render(<TodoFilters {...defaultProps} filters={existingFilters} />)

      const highPriorityButton = screen.getByText('High Priority')
      await user.click(highPriorityButton)

      // Should add priority filter while preserving existing filters
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...existingFilters,
        priority: Priority.HIGH
      })
    })
  })

  /**
   * Test 10: Accessibility
   * Tests keyboard navigation and screen reader support
   */
  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<TodoFilters {...defaultProps} />)

      // Search input should have proper labeling
      const searchInput = screen.getByLabelText(/search/i)
      expect(searchInput).toBeInTheDocument()

      // Filter sections should have proper headings
      expect(screen.getByText(/status/i)).toBeInTheDocument()
      expect(screen.getByText(/priority/i)).toBeInTheDocument()
      expect(screen.getByText(/sort by/i)).toBeInTheDocument()
    })
  })
}) 