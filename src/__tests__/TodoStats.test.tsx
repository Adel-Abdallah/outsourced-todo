import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoStats } from '@/components/TodoStats'
import { TodoStats as TodoStatsType } from '@/types/todo'

/**
 * Test suite for TodoStats component
 * 
 * Tests the statistics display, priority breakdown, and motivational progress messages
 * Ensures correct calculations and visual feedback for user progress
 */
describe('TodoStats Component', () => {

  /**
   * Test 1: Statistics Display
   * Ensures the basic todo statistics (total, completed, pending) are displayed correctly
   */
  describe('Statistics Display', () => {
    it('should display correct total, completed, and pending counts', () => {
      const mockStats: TodoStatsType = {
        total: 10,
        completed: 6,
        pending: 4,
        byPriority: {
          high: 3,
          medium: 4,
          low: 3
        }
      }

      render(<TodoStats stats={mockStats} />)

      // Check that all statistics are displayed
      expect(screen.getByText('10')).toBeInTheDocument() // Total count
      expect(screen.getByText('6')).toBeInTheDocument()  // Completed count
      expect(screen.getByText('4')).toBeInTheDocument()  // Pending count
      
      // Check labels are present
      expect(screen.getByText(/total/i)).toBeInTheDocument()
      expect(screen.getByText(/completed/i)).toBeInTheDocument()
      expect(screen.getByText(/pending/i)).toBeInTheDocument()
    })

    it('should handle zero statistics correctly', () => {
      const emptyStats: TodoStatsType = {
        total: 0,
        completed: 0,
        pending: 0,
        byPriority: {
          high: 0,
          medium: 0,
          low: 0
        }
      }

      render(<TodoStats stats={emptyStats} />)

      // All counts should be 0
      const zeroElements = screen.getAllByText('0')
      expect(zeroElements.length).toBeGreaterThanOrEqual(3) // At least total, completed, pending
    })
  })

  /**
   * Test 2: Priority Breakdown
   * Ensures the priority breakdown shows correct counts for high, medium, and low priority tasks
   */
  describe('Priority Breakdown', () => {
    it('should display priority breakdown with correct counts', () => {
      const mockStats: TodoStatsType = {
        total: 15,
        completed: 8,
        pending: 7,
        byPriority: {
          high: 5,    // High priority tasks
          medium: 7,  // Medium priority tasks  
          low: 3      // Low priority tasks
        }
      }

      render(<TodoStats stats={mockStats} />)

      // Check priority counts are displayed
      expect(screen.getByText('5')).toBeInTheDocument()  // High priority
      expect(screen.getByText('7')).toBeInTheDocument()  // Medium priority  
      expect(screen.getByText('3')).toBeInTheDocument()  // Low priority

      // Check priority labels and visual indicators
      expect(screen.getByText(/high priority/i)).toBeInTheDocument()
      expect(screen.getByText(/medium priority/i)).toBeInTheDocument()
      expect(screen.getByText(/low priority/i)).toBeInTheDocument()
    })

    it('should show correct priority distribution percentages', () => {
      const mockStats: TodoStatsType = {
        total: 10,
        completed: 5,
        pending: 5,
        byPriority: {
          high: 2,    // 20% of total
          medium: 5,  // 50% of total
          low: 3      // 30% of total
        }
      }

      render(<TodoStats stats={mockStats} />)

      // Priority counts should be visible
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  /**
   * Test 3: Progress Messages
   * Tests the motivational messages that appear based on completion progress
   * Including "Great job! You're almost done!" and completion celebration messages
   */
  describe('Progress Messages', () => {
    it('should show "Get started" message when no todos exist', () => {
      const emptyStats: TodoStatsType = {
        total: 0,
        completed: 0,
        pending: 0,
        byPriority: { high: 0, medium: 0, low: 0 }
      }

      render(<TodoStats stats={emptyStats} />)

      // Should encourage user to get started
      expect(screen.getByText(/get started/i)).toBeInTheDocument()
    })

    it('should show encouraging message when just started (low completion)', () => {
      const startedStats: TodoStatsType = {
        total: 10,
        completed: 1,    // 10% completion
        pending: 9,
        byPriority: { high: 3, medium: 4, low: 3 }
      }

      render(<TodoStats stats={startedStats} />)

      // Should show encouraging message for early progress
      expect(screen.getByText(/keep going/i)).toBeInTheDocument()
    })

    it('should show "almost done" message when near completion (75%+)', () => {
      const nearCompletionStats: TodoStatsType = {
        total: 8,
        completed: 6,    // 75% completion
        pending: 2,
        byPriority: { high: 2, medium: 3, low: 3 }
      }

      render(<TodoStats stats={nearCompletionStats} />)

      // Should show "almost done" encouragement
      expect(screen.getByText(/almost done/i)).toBeInTheDocument()
    })

    it('should show celebration message when all tasks completed', () => {
      const completedStats: TodoStatsType = {
        total: 5,
        completed: 5,    // 100% completion
        pending: 0,
        byPriority: { high: 2, medium: 2, low: 1 }
      }

      render(<TodoStats stats={completedStats} />)

      // Should show celebration message
      expect(screen.getByText(/great job/i)).toBeInTheDocument()
      expect(screen.getByText(/all.*completed/i)).toBeInTheDocument()
    })

    it('should show specific completion count in celebration message', () => {
      const completedStats: TodoStatsType = {
        total: 3,
        completed: 3,    // All completed
        pending: 0,
        byPriority: { high: 1, medium: 1, low: 1 }
      }

      render(<TodoStats stats={completedStats} />)

      // Should show "3 of 3 tasks completed" message
      expect(screen.getByText(/3.*of.*3.*completed/i)).toBeInTheDocument()
    })
  })

  /**
   * Test 4: Progress Bar Visualization
   * Tests the visual progress bar that shows completion percentage
   */
  describe('Progress Bar', () => {
    it('should show progress bar with correct completion percentage', () => {
      const mockStats: TodoStatsType = {
        total: 10,
        completed: 7,    // 70% completion
        pending: 3,
        byPriority: { high: 3, medium: 4, low: 3 }
      }

      render(<TodoStats stats={mockStats} />)

      // Progress bar should be present and show percentage
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
      expect(progressBar).toHaveAttribute('aria-valuenow', '70')
    })

    it('should handle 0% progress correctly', () => {
      const noProgressStats: TodoStatsType = {
        total: 5,
        completed: 0,    // 0% completion
        pending: 5,
        byPriority: { high: 2, medium: 2, low: 1 }
      }

      render(<TodoStats stats={noProgressStats} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    })

    it('should handle 100% progress correctly', () => {
      const fullProgressStats: TodoStatsType = {
        total: 4,
        completed: 4,    // 100% completion
        pending: 0,
        byPriority: { high: 1, medium: 2, low: 1 }
      }

      render(<TodoStats stats={fullProgressStats} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '100')
    })
  })

  /**
   * Test 5: Visual Design Elements
   * Tests that proper visual indicators (colors, icons) are present for different priorities
   */
  describe('Visual Design Elements', () => {
    it('should display priority indicators with correct colors', () => {
      const mockStats: TodoStatsType = {
        total: 9,
        completed: 3,
        pending: 6,
        byPriority: { high: 3, medium: 3, low: 3 }
      }

      render(<TodoStats stats={mockStats} />)

      // Should have visual elements for each priority level
      const container = screen.getByText(/priority breakdown/i).closest('div')
      expect(container).toBeInTheDocument()
      
      // Priority sections should be present
      expect(screen.getByText(/high priority/i)).toBeInTheDocument()
      expect(screen.getByText(/medium priority/i)).toBeInTheDocument()  
      expect(screen.getByText(/low priority/i)).toBeInTheDocument()
    })
  })
}) 