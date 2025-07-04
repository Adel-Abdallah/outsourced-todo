
import { TodoProvider } from '@/contexts/TodoContext'
import { TodoApp } from '@/components/TodoApp'
import { ToastProvider, Toaster } from '@/components/ui/toast'
import './index.css'

/**
 * Main App component
 * 
 * This component serves as the root of the todo application,
 * providing the TodoProvider context and rendering the main TodoApp component.
 */
function App() {
  return (
    <ToastProvider>
      <TodoProvider>
        <div className="min-h-screen bg-gray-50">
          <TodoApp />
          <Toaster />
        </div>
      </TodoProvider>
    </ToastProvider>
  )
}

export default App 