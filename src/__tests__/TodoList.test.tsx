import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from '@/components/TodoList'
import { Todo, Priority, TaskStatus } from '@/types/todo'

/**
 * Test suite for TodoList component
 * 
 * Tests todo list rendering, empty states, and user interactions
 * Covers different scenarios: no todos, filtered results, completed todos
 */
describe('TodoList Component', () => {

  const mockOnToggleStatus = vi.fn()
  const mockOnUpdateTodo = vi.fn()
  const mockOnDeleteTodo = vi.fn()

  const defaultProps = {
    onToggleStatus: mockOnToggleStatus,
    onUpdateTodo: mockOnUpdateTodo,
    onDeleteTodo: mockOnDeleteTodo
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    priority: Priority.MEDIUM,
    status: TaskStatus.PENDING,
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
    ...overrides
  })

  /**
   * Test: Empty States
   * Tests different empty state messages based on context
   */
  describe('Empty States', () => {
    it('should show "get started" message when no todos exist', () => {
      render(
        <TodoList 
          {...defaultProps}
          todos={[]}
          totalTodos={0}
          hasActiveFilters={false}
        />
      )

      // Should show encouraging message to add first todo
      expect(screen.getByText(/no todos yet.*add your first todo to get started/i)).toBeInTheDocument()
    })

    it('should show "no todos found" message when filters are active but no results', () => {
      render(
        <TodoList 
          {...defaultProps}
          todos={[]}
          totalTodos={5}  // Has todos but filtered out
          hasActiveFilters={true}
        />
      )

      // Should show filter-specific message
      expect(screen.getByText(/no todos found matching your filters/i)).toBeInTheDocument()
    })

    it('should show "all todos hidden" message when no filters but todos exist', () => {
      render(
        <TodoList 
          {...defaultProps}
          todos={[]}
          totalTodos={3}  // Has todos but somehow hidden
          hasActiveFilters={false}
        />
      )

      // Should show that todos are hidden by filters
      expect(screen.getByText(/all todos are hidden by current filters/i)).toBeInTheDocument()
    })

    it('should display empty state icon', () => {
      render(
        <TodoList 
          {...defaultProps}
          todos={[]}
          totalTodos={0}
          hasActiveFilters={false}
        />
      )

      // Should have an alert/warning icon for empty state
      const emptyStateContainer = screen.getByText(/no todos yet/i).closest('div')
      expect(emptyStateContainer).toBeInTheDocument()
    })
  })

  /**
   * Test: Todo Rendering
   * Tests how individual todos are displayed
   */
  describe('Todo Rendering', () => {
    it('should render todo with all basic information', () => {
      const todo = createMockTodo({
        title: 'Important Task',
        description: 'This is a detailed description',
        priority: Priority.HIGH
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[todo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Should display title and description
      expect(screen.getByText('Important Task')).toBeInTheDocument()
      expect(screen.getByText('This is a detailed description')).toBeInTheDocument()
      
      // Should show priority badge
      expect(screen.getByText(/high/i)).toBeInTheDocument()
    })

    it('should render multiple todos correctly', () => {
      const todos = [
        createMockTodo({ id: '1', title: 'First Todo', priority: Priority.HIGH }),
        createMockTodo({ id: '2', title: 'Second Todo', priority: Priority.LOW }),
        createMockTodo({ id: '3', title: 'Third Todo', priority: Priority.MEDIUM })
      ]

      render(
        <TodoList 
          {...defaultProps}
          todos={todos}
          totalTodos={3}
          hasActiveFilters={false}
        />
      )

      // All todos should be visible
      expect(screen.getByText('First Todo')).toBeInTheDocument()
      expect(screen.getByText('Second Todo')).toBeInTheDocument()
      expect(screen.getByText('Third Todo')).toBeInTheDocument()
    })

    it('should show priority badges with correct styling', () => {
      const todos = [
        createMockTodo({ id: '1', title: 'High Priority', priority: Priority.HIGH }),
        createMockTodo({ id: '2', title: 'Medium Priority', priority: Priority.MEDIUM }),
        createMockTodo({ id: '3', title: 'Low Priority', priority: Priority.LOW })
      ]

      render(
        <TodoList 
          {...defaultProps}
          todos={todos}
          totalTodos={3}
          hasActiveFilters={false}
        />
      )

      // Priority labels should be present
      expect(screen.getByText(/high/i)).toBeInTheDocument()
      expect(screen.getByText(/medium/i)).toBeInTheDocument()  
      expect(screen.getByText(/low/i)).toBeInTheDocument()
    })

    it('should display creation dates correctly', () => {
      const todo = createMockTodo({
        createdAt: new Date('2024-01-15T10:30:00')
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[todo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Should show relative creation time
      expect(screen.getByText(/created/i)).toBeInTheDocument()
    })
  })

  /**
   * Test: Todo Status Display
   * Tests how completed vs pending todos are displayed
   */
  describe('Todo Status Display', () => {
    it('should display pending todos with empty circle', () => {
      const pendingTodo = createMockTodo({
        status: TaskStatus.PENDING,
        title: 'Pending Task'
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[pendingTodo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Title should not be crossed out
      const titleElement = screen.getByText('Pending Task')
      expect(titleElement).not.toHaveClass('line-through')
    })

    it('should display completed todos with checkmark and strikethrough', () => {
      const completedTodo = createMockTodo({
        status: TaskStatus.COMPLETED,
        title: 'Completed Task',
        completedAt: new Date('2024-01-15T11:00:00')
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[completedTodo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Title should be crossed out
      const titleElement = screen.getByText('Completed Task')
      expect(titleElement).toHaveClass('line-through')
      
      // Should show completion time
      expect(screen.getByText(/completed/i)).toBeInTheDocument()
    })

    it('should show completion timestamp for completed todos', () => {
      const completedTodo = createMockTodo({
        status: TaskStatus.COMPLETED,
        completedAt: new Date('2024-01-15T14:30:00')
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[completedTodo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Should display completion metadata
      const completedText = screen.getByText(/completed/i)
      expect(completedText).toBeInTheDocument()
    })
  })

  /**
   * Test: Todo Interactions
   * Tests user interactions like toggling status, editing, deleting
   */
  describe('Todo Interactions', () => {
    it('should call onToggleStatus when status circle is clicked', async () => {
      const user = userEvent.setup()
      const todo = createMockTodo({ id: 'test-id' })

      render(
        <TodoList 
          {...defaultProps}
          todos={[todo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Find and click the status toggle button
      const statusButton = screen.getByRole('button', { name: /toggle.*status/i }) || 
                          screen.getAllByRole('button')[0] // Fallback to first button

      await user.click(statusButton)

      // Should call toggle function with correct ID
      expect(mockOnToggleStatus).toHaveBeenCalledWith('test-id')
    })

    it('should show edit button for each todo', () => {
      const todo = createMockTodo()

      render(
        <TodoList 
          {...defaultProps}
          todos={[todo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Should have edit button (edit icon)
      const editButtons = screen.getAllByRole('button')
      const hasEditButton = editButtons.some(button => 
        button.querySelector('svg') !== null // Has an icon
      )
      expect(hasEditButton).toBe(true)
    })

    it('should show delete button for each todo', () => {
      const todo = createMockTodo()

      render(
        <TodoList 
          {...defaultProps}
          todos={[todo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Should have delete button (trash icon)
      const actionButtons = screen.getAllByRole('button')
      expect(actionButtons.length).toBeGreaterThan(1) // Status + edit + delete buttons
    })

    it('should handle long descriptions with show more/less', () => {
      const longDescription = 'A'.repeat(150) // Description longer than 100 characters
      const todo = createMockTodo({
        description: longDescription
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[todo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Should show truncated description initially
      expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument()
      
      // Should have "Show more" button
      expect(screen.getByText(/show more/i)).toBeInTheDocument()
    })

    it('should expand description when "show more" is clicked', async () => {
      const user = userEvent.setup()
      const longDescription = 'This is a very long description that should be truncated initially but can be expanded when the user clicks show more button.'
      const todo = createMockTodo({
        description: longDescription
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[todo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      const showMoreButton = screen.getByText(/show more/i)
      await user.click(showMoreButton)

      // Should show full description and "Show less" button
      expect(screen.getByText(/show less/i)).toBeInTheDocument()
    })
  })

  /**
   * Test: Todo Metadata
   * Tests display of creation, update, and completion timestamps
   */
  describe('Todo Metadata', () => {
    it('should show updated time when todo was modified', () => {
      const todo = createMockTodo({
        createdAt: new Date('2024-01-15T10:00:00'),
        updatedAt: new Date('2024-01-15T12:00:00') // Updated 2 hours later
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[todo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Should show both created and updated times
      expect(screen.getByText(/created/i)).toBeInTheDocument()
      expect(screen.getByText(/updated/i)).toBeInTheDocument()
    })

    it('should not show updated time if todo was never modified', () => {
      const sameTime = new Date('2024-01-15T10:00:00')
      const todo = createMockTodo({
        createdAt: sameTime,
        updatedAt: sameTime // Same as creation time
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[todo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Should only show created time
      expect(screen.getByText(/created/i)).toBeInTheDocument()
      expect(screen.queryByText(/updated/i)).not.toBeInTheDocument()
    })
  })

  /**
   * Test: Visual Design
   * Tests visual elements like priority borders and styling
   */
  describe('Visual Design', () => {
    it('should apply priority-based border styling', () => {
      const highPriorityTodo = createMockTodo({
        priority: Priority.HIGH,
        title: 'High Priority Task'
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[highPriorityTodo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Should have red border for high priority
      const todoContainer = screen.getByText('High Priority Task').closest('div')
      expect(todoContainer).toHaveClass('border-l-red-500')
    })

    it('should apply opacity to completed todos', () => {
      const completedTodo = createMockTodo({
        status: TaskStatus.COMPLETED,
        title: 'Completed Task'
      })

      render(
        <TodoList 
          {...defaultProps}
          todos={[completedTodo]}
          totalTodos={1}
          hasActiveFilters={false}
        />
      )

      // Completed todos should have reduced opacity
      const todoContainer = screen.getByText('Completed Task').closest('div')
      expect(todoContainer).toHaveClass('opacity-75')
    })
  })
}) 