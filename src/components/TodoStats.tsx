import React from 'react'
import { TodoStats as TodoStatsType } from '@/types/todo'
import { CheckCircle, Circle, AlertCircle, Clock, TrendingUp } from 'lucide-react'

/**
 * TodoStats component props
 */
interface TodoStatsProps {
  /** Todo statistics data */
  stats: TodoStatsType
}

/**
 * TodoStats component
 * 
 * Displays comprehensive statistics about todos including:
 * - Total and completed count
 * - Completion percentage
 * - Priority breakdown
 * - Visual indicators and progress bars
 * 
 * @param stats - Todo statistics data
 */
export function TodoStats({ stats }: TodoStatsProps) {
  /**
   * Calculate completion percentage
   */
  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

  /**
   * Get priority color class
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-navy-700" />
        Statistics
      </h2>
      
      <div className="space-y-4">
        {/* Total Tasks */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Circle className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Total Tasks</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">{stats.total}</span>
        </div>

        {/* Completed Tasks */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Completed</span>
          </div>
          <span className="text-lg font-semibold text-green-600">{stats.completed}</span>
        </div>

        {/* Pending Tasks */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Pending</span>
          </div>
          <span className="text-lg font-semibold text-orange-600">{stats.pending}</span>
        </div>

        {/* Progress Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-navy-700 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
            Priority Breakdown
          </h3>
          
          <div className="space-y-2">
            {/* High Priority */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">High</span>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${getPriorityColor('high')}`}>
                {stats.byPriority.high}
              </span>
            </div>

            {/* Medium Priority */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Medium</span>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${getPriorityColor('medium')}`}>
                {stats.byPriority.medium}
              </span>
            </div>

            {/* Low Priority */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Low</span>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${getPriorityColor('low')}`}>
                {stats.byPriority.low}
              </span>
            </div>
          </div>
        </div>

        {/* Completion Rate Message */}
        {stats.total > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className={`p-3 rounded-lg ${
              completionPercentage >= 80 
                ? 'bg-green-50 border border-green-200' 
                : completionPercentage >= 50 
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-sm font-medium ${
                completionPercentage >= 80 
                  ? 'text-green-800' 
                  : completionPercentage >= 50 
                    ? 'text-yellow-800'
                    : 'text-blue-800'
              }`}>
                {completionPercentage >= 80 
                  ? '🎉 Great job! You\'re almost done!'
                  : completionPercentage >= 50 
                    ? '💪 You\'re halfway there!'
                    : '🚀 Keep going! You\'ve got this!'
                }
              </p>
              <p className={`text-xs mt-1 ${
                completionPercentage >= 80 
                  ? 'text-green-600' 
                  : completionPercentage >= 50 
                    ? 'text-yellow-600'
                    : 'text-blue-600'
              }`}>
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 