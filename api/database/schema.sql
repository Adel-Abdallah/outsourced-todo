-- Todo Application Database Schema
-- This file contains the SQLite database schema for the todo application

-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
CREATE INDEX IF NOT EXISTS idx_todos_updated_at ON todos(updated_at);

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_todos_updated_at 
    AFTER UPDATE ON todos
    FOR EACH ROW
    WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create a trigger to set completed_at when status changes to completed
CREATE TRIGGER IF NOT EXISTS update_todos_completed_at 
    AFTER UPDATE ON todos
    FOR EACH ROW
    WHEN NEW.status = 'completed' AND OLD.status != 'completed'
BEGIN
    UPDATE todos SET completed_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create a trigger to clear completed_at when status changes from completed
CREATE TRIGGER IF NOT EXISTS clear_todos_completed_at 
    AFTER UPDATE ON todos
    FOR EACH ROW
    WHEN NEW.status != 'completed' AND OLD.status = 'completed'
BEGIN
    UPDATE todos SET completed_at = NULL WHERE id = NEW.id;
END;

-- Insert some sample data for testing
INSERT OR IGNORE INTO todos (id, title, description, priority, status, created_at, updated_at) VALUES
(1, 'Complete project proposal', 'Finish writing the project proposal document for the client meeting', 'high', 'pending', '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
(2, 'Review code changes', 'Review and approve the pull request for the new feature', 'medium', 'pending', '2024-01-15 11:00:00', '2024-01-15 11:00:00'),
(3, 'Update documentation', 'Update the API documentation with new endpoints', 'low', 'completed', '2024-01-14 09:00:00', '2024-01-14 15:30:00'),
(4, 'Fix login bug', 'Investigate and fix the login issue reported by users', 'high', 'pending', '2024-01-15 12:00:00', '2024-01-15 12:00:00'),
(5, 'Prepare presentation', 'Create slides for the quarterly business review', 'medium', 'pending', '2024-01-15 13:00:00', '2024-01-15 13:00:00');

-- Update completed_at for completed tasks
UPDATE todos SET completed_at = '2024-01-14 15:30:00' WHERE id = 3; 