import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilters, TodoSort, TodoStats, TaskStatus } from '@/types/todo'
import { todoApi } from '@/services/api'
import { useToast } from '@/components/ui/toast'

/**
 * Todo Context State Interface
 * 
 * Defines the shape of the todo application state
 */
interface TodoState {
  allTodos: Todo[] // All todos from storage
  todos: Todo[] // Filtered and sorted todos
  stats: TodoStats
  filters: TodoFilters
  sort: TodoSort
  isLoading: boolean
  error: string | null
}

/**
 * Todo Context Actions
 * 
 * Defines all possible actions that can be dispatched to modify todo state
 */
type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TODOS'; payload: { todos: Todo[]; stats: TodoStats } }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_FILTERS'; payload: TodoFilters }
  | { type: 'SET_SORT'; payload: TodoSort }

/**
 * Todo Context Value Interface
 * 
 * Defines the shape of the context value provided to components
 */
interface TodoContextValue {
  state: TodoState
  actions: {
    loadTodos: () => Promise<void>
    createTodo: (todo: CreateTodoRequest) => Promise<void>
    updateTodo: (todo: UpdateTodoRequest) => Promise<void>
    deleteTodo: (id: string) => Promise<void>
    toggleTodoStatus: (id: string) => Promise<void>
    setFilters: (filters: TodoFilters) => void
    setSort: (sort: TodoSort) => void
    clearError: () => void
  }
}

/**
 * Initial state for the todo context
 */
const initialState: TodoState = {
  allTodos: [],
  todos: [],
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
    byPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
  },
  filters: {},
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  isLoading: false,
  error: null,
}

/**
 * Apply filters and sorting to todos
 */
function filterAndSortTodos(todos: Todo[], filters: TodoFilters, sort: TodoSort): Todo[] {
  let filtered = [...todos]

  // Apply filters
  if (filters.status) {
    filtered = filtered.filter(todo => todo.status === filters.status)
  }

  if (filters.priority) {
    filtered = filtered.filter(todo => todo.priority === filters.priority)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(todo =>
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.description && todo.description.toLowerCase().includes(searchLower))
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aVal: any, bVal: any

    switch (sort.field) {
      case 'priority':
        const priorityOrder = { high: 1, medium: 2, low: 3 }
        aVal = priorityOrder[a.priority]
        bVal = priorityOrder[b.priority]
        break
      case 'title':
        aVal = a.title.toLowerCase()
        bVal = b.title.toLowerCase()
        break
      case 'createdAt':
        aVal = a.createdAt.getTime()
        bVal = b.createdAt.getTime()
        break
      case 'updatedAt':
        aVal = a.updatedAt.getTime()
        bVal = b.updatedAt.getTime()
        break
      default:
        aVal = a.createdAt.getTime()
        bVal = b.createdAt.getTime()
    }

    if (sort.direction === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })

  return filtered
}

/**
 * Todo reducer function
 * 
 * Handles state updates based on dispatched actions
 * @param state Current state
 * @param action Action to process
 * @returns New state
 */
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    
    case 'SET_TODOS':
      const mappedTodos = action.payload.todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
      }))
      const filteredMappedTodos = filterAndSortTodos(mappedTodos, state.filters, state.sort)
      return { 
        ...state, 
        allTodos: mappedTodos,
        todos: filteredMappedTodos,
        stats: action.payload.stats,
        isLoading: false,
        error: null,
      }
    
    case 'ADD_TODO':
      const newTodo = {
        ...action.payload,
        createdAt: new Date(action.payload.createdAt),
        updatedAt: new Date(action.payload.updatedAt),
        completedAt: action.payload.completedAt ? new Date(action.payload.completedAt) : undefined,
      }
      const newAllTodos = [...state.allTodos, newTodo]
      const filteredNewTodos = filterAndSortTodos(newAllTodos, state.filters, state.sort)
      return {
        ...state,
        allTodos: newAllTodos,
        todos: filteredNewTodos,
        stats: {
          ...state.stats,
          total: state.stats.total + 1,
          pending: state.stats.pending + 1,
          byPriority: {
            ...state.stats.byPriority,
            [action.payload.priority]: state.stats.byPriority[action.payload.priority] + 1,
          },
        },
      }
    
    case 'UPDATE_TODO':
      const updatedAllTodos = state.allTodos.map(todo =>
        todo.id === action.payload.id
          ? {
              ...action.payload,
              createdAt: new Date(action.payload.createdAt),
              updatedAt: new Date(action.payload.updatedAt),
              completedAt: action.payload.completedAt ? new Date(action.payload.completedAt) : undefined,
            }
          : todo
      )
      const filteredUpdatedTodos = filterAndSortTodos(updatedAllTodos, state.filters, state.sort)
      return {
        ...state,
        allTodos: updatedAllTodos,
        todos: filteredUpdatedTodos,
      }
    
    case 'DELETE_TODO':
      const todoToDelete = state.allTodos.find(todo => todo.id === action.payload)
      if (!todoToDelete) return state
      
      const filteredAllTodos = state.allTodos.filter(todo => todo.id !== action.payload)
      const filteredDeletedTodos = filterAndSortTodos(filteredAllTodos, state.filters, state.sort)
      return {
        ...state,
        allTodos: filteredAllTodos,
        todos: filteredDeletedTodos,
        stats: {
          ...state.stats,
          total: state.stats.total - 1,
          [todoToDelete.status]: state.stats[todoToDelete.status] - 1,
          byPriority: {
            ...state.stats.byPriority,
            [todoToDelete.priority]: state.stats.byPriority[todoToDelete.priority] - 1,
          },
        },
      }
    
    case 'SET_FILTERS':
      const filteredByFilters = filterAndSortTodos(state.allTodos, action.payload, state.sort)
      return { 
        ...state, 
        filters: action.payload,
        todos: filteredByFilters,
      }
    
    case 'SET_SORT':
      const filteredBySort = filterAndSortTodos(state.allTodos, state.filters, action.payload)
      return { 
        ...state, 
        sort: action.payload,
        todos: filteredBySort,
      }
    
    default:
      return state
  }
}

/**
 * Todo Context
 * 
 * Provides todo state and actions to child components
 */
const TodoContext = createContext<TodoContextValue | undefined>(undefined)

/**
 * Todo Provider Component
 * 
 * Wraps the application and provides todo context
 * @param children Child components
 */
export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  const { addToast } = useToast()

  /**
   * Load todos from the API
   */
  const loadTodos = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await todoApi.getTodos()
      dispatch({ type: 'SET_TODOS', payload: { todos: response.data || [], stats: response.stats } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load todos' })
    }
  }, [])

  /**
   * Create a new todo
   * @param todo Todo data to create
   */
  const createTodo = useCallback(async (todo: CreateTodoRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await todoApi.createTodo(todo)
      if (response.data) {
        dispatch({ type: 'ADD_TODO', payload: response.data })
        addToast({
          type: 'success',
          title: 'Todo created',
          message: 'Your todo has been created successfully!',
        })
      }
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create todo' })
    }
  }, [addToast])

  /**
   * Update an existing todo
   * @param todo Todo data to update
   */
  const updateTodo = useCallback(async (todo: UpdateTodoRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await todoApi.updateTodo(todo)
      if (response.data) {
        dispatch({ type: 'UPDATE_TODO', payload: response.data })
        addToast({
          type: 'success',
          title: 'Todo updated',
          message: 'Your todo has been updated successfully!',
        })
      }
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update todo' })
    }
  }, [addToast])

  /**
   * Delete a todo
   * @param id Todo ID to delete
   */
  const deleteTodo = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await todoApi.deleteTodo(id)
      dispatch({ type: 'DELETE_TODO', payload: id })
      addToast({
        type: 'success',
        title: 'Todo deleted',
        message: 'Your todo has been deleted successfully!',
      })
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete todo' })
    }
  }, [addToast])

  /**
   * Toggle todo status between pending and completed
   * @param id Todo ID to toggle
   */
  const toggleTodoStatus = useCallback(async (id: string) => {
    const todo = state.allTodos.find((t: Todo) => t.id === id)
    if (!todo) return

    const newStatus = todo.status === TaskStatus.PENDING ? TaskStatus.COMPLETED : TaskStatus.PENDING
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await todoApi.updateTodo({ id, status: newStatus })
      if (response.data) {
        dispatch({ type: 'UPDATE_TODO', payload: response.data })
        addToast({
          type: 'success',
          title: newStatus === TaskStatus.COMPLETED ? 'Todo completed' : 'Todo reopened',
          message: newStatus === TaskStatus.COMPLETED ? 'Great job completing this task!' : 'Todo has been reopened.',
        })
      }
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update todo status' })
    }
  }, [state.allTodos, addToast])

  /**
   * Set filters for todo list
   * @param filters Filters to apply
   */
  const setFilters = useCallback((filters: TodoFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }, [])

  /**
   * Set sorting for todo list
   * @param sort Sort configuration
   */
  const setSort = useCallback((sort: TodoSort) => {
    dispatch({ type: 'SET_SORT', payload: sort })
  }, [])



  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }, [])

  const contextValue: TodoContextValue = {
    state,
    actions: {
      loadTodos,
      createTodo,
      updateTodo,
      deleteTodo,
      toggleTodoStatus,
      setFilters,
      setSort,
      clearError,
    },
  }

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  )
}

/**
 * Custom hook to use todo context
 * 
 * @returns Todo context value
 * @throws Error if used outside of TodoProvider
 */
export function useTodo(): TodoContextValue {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
} 