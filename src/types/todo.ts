/**
 * Priority levels for todo tasks
 * High priority tasks are shown first, followed by medium and low priority tasks
 */
export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Status of a todo task
 * - PENDING: Task is not yet completed
 * - COMPLETED: Task has been completed
 */
export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

/**
 * Main todo item interface
 * Represents a single task in the todo list
 */
export interface Todo {
  /** Unique identifier for the todo item */
  id: string;
  
  /** The task description or title */
  title: string;
  
  /** Optional detailed description of the task */
  description?: string;
  
  /** Priority level of the task */
  priority: Priority;
  
  /** Current status of the task */
  status: TaskStatus;
  
  /** Timestamp when the task was created */
  createdAt: Date;
  
  /** Timestamp when the task was last updated */
  updatedAt: Date;
  
  /** Optional timestamp when the task was completed */
  completedAt?: Date;
}

/**
 * Interface for creating a new todo item
 * Excludes auto-generated fields like id and timestamps
 */
export interface CreateTodoRequest {
  /** The task description or title */
  title: string;
  
  /** Optional detailed description of the task */
  description?: string;
  
  /** Priority level of the task */
  priority: Priority;
}

/**
 * Interface for updating an existing todo item
 * All fields are optional except id
 */
export interface UpdateTodoRequest {
  /** Unique identifier for the todo item */
  id: string;
  
  /** The task description or title */
  title?: string;
  
  /** Optional detailed description of the task */
  description?: string;
  
  /** Priority level of the task */
  priority?: Priority;
  
  /** Current status of the task */
  status?: TaskStatus;
}

/**
 * Filter options for displaying todos
 */
export interface TodoFilters {
  /** Filter by task status */
  status?: TaskStatus;
  
  /** Filter by priority level */
  priority?: Priority;
  
  /** Search query for title/description */
  search?: string;
}

/**
 * Sorting options for todo list
 */
export interface TodoSort {
  /** Field to sort by */
  field: 'title' | 'priority' | 'createdAt' | 'updatedAt';
  
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Statistics about todo items
 */
export interface TodoStats {
  /** Total number of todos */
  total: number;
  
  /** Number of completed todos */
  completed: number;
  
  /** Number of pending todos */
  pending: number;
  
  /** Breakdown by priority */
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * API response wrapper for todo operations
 */
export interface TodoApiResponse<T = any> {
  /** Whether the operation was successful */
  success: boolean;
  
  /** Response data */
  data?: T;
  
  /** Error message if operation failed */
  error?: string;
  
  /** Additional metadata */
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
  };
} 