import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  generateId,
  formatDate,
  formatRelativeTime,
  capitalize,
  debounce,
  isValidString,
  safeParseJSON,
} from '@/lib/utils'

/**
 * Test suite for utility functions
 * 
 * This file contains comprehensive tests for all utility functions
 * to ensure they work correctly and handle edge cases properly.
 */
describe('Utility Functions', () => {
  
  /**
   * Test generateId function
   * Ensures unique IDs are generated with proper format
   */
  describe('generateId', () => {
    it('should generate a unique string ID', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      // IDs should be strings
      expect(typeof id1).toBe('string')
      expect(typeof id2).toBe('string')
      
      // IDs should be different
      expect(id1).not.toBe(id2)
      
      // IDs should contain timestamp and random parts
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/)
    })

    it('should generate IDs with consistent format', () => {
      const id = generateId()
      const parts = id.split('-')
      
      // Should have exactly 2 parts separated by dash
      expect(parts).toHaveLength(2)
      
      // First part should be numeric (timestamp)
      expect(parseInt(parts[0])).not.toBeNaN()
      
      // Second part should be alphanumeric
      expect(parts[1]).toMatch(/^[a-z0-9]+$/)
    })
  })

  /**
   * Test formatDate function
   * Ensures dates are formatted correctly with various options
   */
  describe('formatDate', () => {
    const testDate = new Date('2024-01-15T10:30:00')

    it('should format date with default options', () => {
      const formatted = formatDate(testDate)
      
      // Should contain month, day, year, and time
      expect(formatted).toMatch(/Jan.*15.*2024.*10:30/)
    })

    it('should format date with custom options', () => {
      const formatted = formatDate(testDate, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      // Should contain full month name
      expect(formatted).toMatch(/January.*15.*2024/)
    })

    it('should handle different date formats', () => {
      const dates = [
        new Date('2024-01-01'),
        new Date('2024-12-31'),
        new Date('2024-06-15T15:45:30')
      ]

      dates.forEach(date => {
        const formatted = formatDate(date)
        expect(typeof formatted).toBe('string')
        expect(formatted.length).toBeGreaterThan(0)
      })
    })
  })

  /**
   * Test formatRelativeTime function
   * Ensures relative time formatting works for all time ranges
   */
  describe('formatRelativeTime', () => {
    const now = new Date()

    it('should return "just now" for very recent dates', () => {
      const recentDate = new Date(now.getTime() - 30 * 1000) // 30 seconds ago
      expect(formatRelativeTime(recentDate)).toBe('just now')
    })

    it('should format minutes correctly', () => {
      const minutesAgo = new Date(now.getTime() - 5 * 60 * 1000) // 5 minutes ago
      expect(formatRelativeTime(minutesAgo)).toBe('5 minutes ago')
      
      const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000) // 1 minute ago
      expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago')
    })

    it('should format hours correctly', () => {
      const hoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000) // 3 hours ago
      expect(formatRelativeTime(hoursAgo)).toBe('3 hours ago')
      
      const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000) // 1 hour ago
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago')
    })

    it('should format days correctly', () => {
      const daysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      expect(formatRelativeTime(daysAgo)).toBe('5 days ago')
      
      const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago')
    })

    it('should format months correctly', () => {
      const monthsAgo = new Date(now.getTime() - 2 * 30 * 24 * 60 * 60 * 1000) // ~2 months ago
      expect(formatRelativeTime(monthsAgo)).toBe('2 months ago')
    })

    it('should format years correctly', () => {
      const yearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000) // ~2 years ago
      expect(formatRelativeTime(yearsAgo)).toBe('2 years ago')
    })
  })

  /**
   * Test capitalize function
   * Ensures proper capitalization of strings
   */
  describe('capitalize', () => {
    it('should capitalize first letter of lowercase string', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('world')).toBe('World')
    })

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello')
      expect(capitalize('WORLD')).toBe('WORLD')
    })

    it('should handle empty and single character strings', () => {
      expect(capitalize('')).toBe('')
      expect(capitalize('a')).toBe('A')
      expect(capitalize('A')).toBe('A')
    })

    it('should handle special characters and numbers', () => {
      expect(capitalize('123abc')).toBe('123abc')
      expect(capitalize('!hello')).toBe('!hello')
      expect(capitalize(' hello')).toBe(' hello')
    })
  })

  /**
   * Test debounce function
   * Ensures debouncing works correctly with proper timing
   */
  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should delay function execution', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous calls when called multiple times', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments correctly', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1', 'arg2')
      vi.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  /**
   * Test isValidString function
   * Ensures proper string validation
   */
  describe('isValidString', () => {
    it('should return true for valid non-empty strings', () => {
      expect(isValidString('hello')).toBe(true)
      expect(isValidString('world')).toBe(true)
      expect(isValidString('a')).toBe(true)
    })

    it('should return false for empty or whitespace-only strings', () => {
      expect(isValidString('')).toBe(false)
      expect(isValidString('   ')).toBe(false)
      expect(isValidString('\t\n')).toBe(false)
    })

    it('should return false for non-string values', () => {
      expect(isValidString(null as any)).toBe(false)
      expect(isValidString(undefined as any)).toBe(false)
      expect(isValidString(123 as any)).toBe(false)
      expect(isValidString({} as any)).toBe(false)
    })

    it('should return true for strings with meaningful content', () => {
      expect(isValidString('  hello  ')).toBe(true)
      expect(isValidString('hello world')).toBe(true)
      expect(isValidString('123')).toBe(true)
    })
  })

  /**
   * Test safeParseJSON function
   * Ensures safe JSON parsing with proper fallbacks
   */
  describe('safeParseJSON', () => {
    it('should parse valid JSON correctly', () => {
      const validJson = '{"name": "John", "age": 30}'
      const result = safeParseJSON(validJson, {})
      
      expect(result).toEqual({ name: 'John', age: 30 })
    })

    it('should return fallback for invalid JSON', () => {
      const invalidJson = '{"name": "John", "age":}'
      const fallback = { error: true }
      const result = safeParseJSON(invalidJson, fallback)
      
      expect(result).toBe(fallback)
    })

    it('should handle different fallback types', () => {
      const invalidJson = 'invalid'
      
      expect(safeParseJSON(invalidJson, null)).toBe(null)
      expect(safeParseJSON(invalidJson, [])).toEqual([])
      expect(safeParseJSON(invalidJson, 'default')).toBe('default')
      expect(safeParseJSON(invalidJson, 42)).toBe(42)
    })

    it('should parse arrays correctly', () => {
      const arrayJson = '[1, 2, 3, "test"]'
      const result = safeParseJSON(arrayJson, [])
      
      expect(result).toEqual([1, 2, 3, 'test'])
    })

    it('should handle nested objects', () => {
      const nestedJson = '{"user": {"name": "John", "settings": {"theme": "dark"}}}'
      const result = safeParseJSON(nestedJson, {})
      
      expect(result).toEqual({
        user: {
          name: 'John',
          settings: {
            theme: 'dark'
          }
        }
      })
    })
  })
}) 