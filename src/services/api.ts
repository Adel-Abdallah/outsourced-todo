import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoApiResponse, TodoStats, Priority, TaskStatus } from '@/types/todo'
import { generateId } from '@/lib/utils'

/**
 * localStorage key for storing todos
 */
const STORAGE_KEY = 'todos'

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Get todos from localStorage
 */
function getTodosFromStorage(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      // Start with an empty array if no todos exist
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
      return []
    }
    const todos = JSON.parse(stored)
    // Convert date strings back to Date objects
    return todos.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt),
      completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
    }))
  } catch (error) {
    console.error('Error reading todos from localStorage:', error)
    return []
  }
}

/**
 * Save todos to localStorage
 */
function saveTodosToStorage(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.error('Error saving todos to localStorage:', error)
    throw new ApiError('Failed to save todos', 500)
  }
}

/**
 * Calculate statistics from todos
 */
function calculateStats(todos: Todo[]): TodoStats {
  const total = todos.length
  const completed = todos.filter(todo => todo.status === TaskStatus.COMPLETED).length
  const pending = todos.filter(todo => todo.status === TaskStatus.PENDING).length

  const byPriority = {
    high: todos.filter(todo => todo.priority === Priority.HIGH).length,
    medium: todos.filter(todo => todo.priority === Priority.MEDIUM).length,
    low: todos.filter(todo => todo.priority === Priority.LOW).length,
  }

  return { total, completed, pending, byPriority }
}

/**
 * Simulate API delay for realistic feel
 */
function delay(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Todo API service using localStorage
 * 
 * Provides methods for interacting with todos stored in localStorage
 */
export const todoApi = {
  /**
   * Get all todos (no filtering - done in frontend)
   * 
   * @returns Promise with all todos and stats
   */
  async getTodos(): Promise<TodoApiResponse<Todo[]> & { stats: TodoStats }> {
    await delay(150) // Simulate network delay
    
    try {
      const allTodos = getTodosFromStorage()
      const stats = calculateStats(allTodos)
      
      return {
        success: true,
        data: allTodos,
        stats
      }
    } catch (error) {
      throw new ApiError('Failed to get todos', 500)
    }
  },

  /**
   * Create a new todo
   * 
   * @param todo Todo data to create
   * @returns Promise with created todo
   */
  async createTodo(todo: CreateTodoRequest): Promise<TodoApiResponse<Todo>> {
    await delay(200) // Simulate network delay
    
    try {
      const todos = getTodosFromStorage()
      
      const newTodo: Todo = {
        id: generateId(),
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      todos.push(newTodo)
      saveTodosToStorage(todos)
      
      return {
        success: true,
        data: newTodo
      }
    } catch (error) {
      throw new ApiError('Failed to create todo', 500)
    }
  },

  /**
   * Update an existing todo
   * 
   * @param todoUpdate Todo data to update
   * @returns Promise with updated todo
   */
  async updateTodo(todoUpdate: UpdateTodoRequest): Promise<TodoApiResponse<Todo>> {
    await delay(150) // Simulate network delay
    
    try {
      const todos = getTodosFromStorage()
      const todoIndex = todos.findIndex(t => t.id === todoUpdate.id)
      
      if (todoIndex === -1) {
        throw new ApiError('Todo not found', 404)
      }
      
      const existingTodo = todos[todoIndex]
      const now = new Date()
      
      // Update the todo
      const updatedTodo: Todo = {
        ...existingTodo,
        ...todoUpdate,
        updatedAt: now,
        // Set completedAt when status changes to completed
        completedAt: todoUpdate.status === TaskStatus.COMPLETED && existingTodo.status !== TaskStatus.COMPLETED
          ? now
          : todoUpdate.status === TaskStatus.PENDING
            ? undefined
            : existingTodo.completedAt
      }
      
      todos[todoIndex] = updatedTodo
      saveTodosToStorage(todos)
      
      return {
        success: true,
        data: updatedTodo
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to update todo', 500)
    }
  },

  /**
   * Delete a todo
   * 
   * @param id Todo ID to delete
   * @returns Promise with success response
   */
  async deleteTodo(id: string): Promise<TodoApiResponse<void>> {
    await delay(100) // Simulate network delay
    
    try {
      const todos = getTodosFromStorage()
      const todoIndex = todos.findIndex(t => t.id === id)
      
      if (todoIndex === -1) {
        throw new ApiError('Todo not found', 404)
      }
      
      todos.splice(todoIndex, 1)
      saveTodosToStorage(todos)
      
      return {
        success: true
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Failed to delete todo', 500)
    }
  },

  /**
   * Toggle todo status between pending and completed
   * 
   * @param id Todo ID to toggle
   * @param currentStatus Current status of the todo
   * @returns Promise with updated todo
   */
  async toggleTodoStatus(id: string, currentStatus: string): Promise<TodoApiResponse<Todo>> {
    const newStatus = currentStatus === 'pending' ? TaskStatus.COMPLETED : TaskStatus.PENDING
    return await this.updateTodo({ id, status: newStatus })
  },

  /**
   * Get todo statistics
   * 
   * @returns Promise with todo statistics
   */
  async getStats(): Promise<TodoApiResponse<TodoStats>> {
    const response = await this.getTodos()
    return {
      success: true,
      data: response.stats,
    }
  },
}

/**
 * Health check function - always returns true for localStorage
 * 
 * @returns Promise indicating if localStorage is accessible
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    // Test localStorage access
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    return true
  } catch (error) {
    console.error('localStorage not available:', error)
    return false
  }
} 