<?php
/**
 * Todo API Endpoint
 * 
 * This file handles all todo-related API requests including:
 * - GET: Retrieve todos with filtering and sorting
 * - POST: Create new todo
 * - PUT: Update existing todo
 * - DELETE: Delete todo
 */

// Include database configuration
require_once __DIR__ . '/config/database.php';

// Set JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 3600');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Send JSON response
 * 
 * @param array $data Response data
 * @param int $statusCode HTTP status code
 */
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

/**
 * Send error response
 * 
 * @param string $message Error message
 * @param int $statusCode HTTP status code
 */
function sendError($message, $statusCode = 400) {
    sendResponse([
        'success' => false,
        'error' => $message
    ], $statusCode);
}

/**
 * Validate todo data
 * 
 * @param array $data Todo data to validate
 * @return array Validation errors
 */
function validateTodo($data) {
    $errors = [];
    
    // Validate title
    if (!isset($data['title']) || empty(trim($data['title']))) {
        $errors[] = 'Title is required';
    } elseif (strlen(trim($data['title'])) > 255) {
        $errors[] = 'Title must be 255 characters or less';
    }
    
    // Validate priority
    if (!isset($data['priority']) || !in_array($data['priority'], ['high', 'medium', 'low'])) {
        $errors[] = 'Priority must be one of: high, medium, low';
    }
    
    // Validate status (if provided)
    if (isset($data['status']) && !in_array($data['status'], ['pending', 'completed'])) {
        $errors[] = 'Status must be one of: pending, completed';
    }
    
    // Validate description length
    if (isset($data['description']) && strlen($data['description']) > 1000) {
        $errors[] = 'Description must be 1000 characters or less';
    }
    
    return $errors;
}

/**
 * Get all todos with filtering and sorting
 */
function getTodos() {
    try {
        $db = getDbConnection();
        
        // Build query with filters
        $query = "SELECT * FROM todos WHERE 1=1";
        $params = [];
        
        // Filter by status
        if (isset($_GET['status']) && in_array($_GET['status'], ['pending', 'completed'])) {
            $query .= " AND status = :status";
            $params[':status'] = $_GET['status'];
        }
        
        // Filter by priority
        if (isset($_GET['priority']) && in_array($_GET['priority'], ['high', 'medium', 'low'])) {
            $query .= " AND priority = :priority";
            $params[':priority'] = $_GET['priority'];
        }
        
        // Search in title and description
        if (isset($_GET['search']) && !empty(trim($_GET['search']))) {
            $query .= " AND (title LIKE :search OR description LIKE :search)";
            $params[':search'] = '%' . trim($_GET['search']) . '%';
        }
        
        // Add sorting
        $sortField = isset($_GET['sort']) ? $_GET['sort'] : 'created_at';
        $sortDirection = isset($_GET['direction']) && $_GET['direction'] === 'asc' ? 'ASC' : 'DESC';
        
        // Validate sort field
        $allowedSortFields = ['title', 'priority', 'status', 'created_at', 'updated_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        // Custom sorting for priority
        if ($sortField === 'priority') {
            $query .= " ORDER BY CASE priority 
                        WHEN 'high' THEN 1 
                        WHEN 'medium' THEN 2 
                        WHEN 'low' THEN 3 
                        END " . $sortDirection;
        } else {
            $query .= " ORDER BY $sortField $sortDirection";
        }
        
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $todos = $stmt->fetchAll();
        
        // Get statistics
        $statsQuery = "SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority,
            SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) as medium_priority,
            SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) as low_priority
            FROM todos";
        
        $statsStmt = $db->prepare($statsQuery);
        $statsStmt->execute();
        $stats = $statsStmt->fetch();
        
        sendResponse([
            'success' => true,
            'data' => $todos,
            'stats' => [
                'total' => (int)$stats['total'],
                'completed' => (int)$stats['completed'],
                'pending' => (int)$stats['pending'],
                'byPriority' => [
                    'high' => (int)$stats['high_priority'],
                    'medium' => (int)$stats['medium_priority'],
                    'low' => (int)$stats['low_priority']
                ]
            ]
        ]);
        
    } catch (Exception $e) {
        sendError('Failed to retrieve todos: ' . $e->getMessage(), 500);
    }
}

/**
 * Create a new todo
 */
function createTodo() {
    try {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data) {
            sendError('Invalid JSON data');
        }
        
        // Validate data
        $errors = validateTodo($data);
        if (!empty($errors)) {
            sendError('Validation failed: ' . implode(', ', $errors));
        }
        
        $db = getDbConnection();
        
        $query = "INSERT INTO todos (title, description, priority, status) VALUES (:title, :description, :priority, :status)";
        $stmt = $db->prepare($query);
        
        $stmt->execute([
            ':title' => trim($data['title']),
            ':description' => isset($data['description']) ? trim($data['description']) : null,
            ':priority' => $data['priority'],
            ':status' => isset($data['status']) ? $data['status'] : 'pending'
        ]);
        
        $todoId = $db->lastInsertId();
        
        // Get the created todo
        $getTodoQuery = "SELECT * FROM todos WHERE id = :id";
        $getTodoStmt = $db->prepare($getTodoQuery);
        $getTodoStmt->execute([':id' => $todoId]);
        $todo = $getTodoStmt->fetch();
        
        sendResponse([
            'success' => true,
            'data' => $todo,
            'message' => 'Todo created successfully'
        ], 201);
        
    } catch (Exception $e) {
        sendError('Failed to create todo: ' . $e->getMessage(), 500);
    }
}

/**
 * Update an existing todo
 */
function updateTodo() {
    try {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data) {
            sendError('Invalid JSON data');
        }
        
        if (!isset($data['id'])) {
            sendError('Todo ID is required');
        }
        
        $db = getDbConnection();
        
        // Check if todo exists
        $checkQuery = "SELECT id FROM todos WHERE id = :id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->execute([':id' => $data['id']]);
        
        if (!$checkStmt->fetch()) {
            sendError('Todo not found', 404);
        }
        
        // Build update query dynamically
        $updateFields = [];
        $params = [':id' => $data['id']];
        
        if (isset($data['title'])) {
            if (empty(trim($data['title']))) {
                sendError('Title cannot be empty');
            }
            $updateFields[] = 'title = :title';
            $params[':title'] = trim($data['title']);
        }
        
        if (isset($data['description'])) {
            $updateFields[] = 'description = :description';
            $params[':description'] = trim($data['description']);
        }
        
        if (isset($data['priority'])) {
            if (!in_array($data['priority'], ['high', 'medium', 'low'])) {
                sendError('Invalid priority value');
            }
            $updateFields[] = 'priority = :priority';
            $params[':priority'] = $data['priority'];
        }
        
        if (isset($data['status'])) {
            if (!in_array($data['status'], ['pending', 'completed'])) {
                sendError('Invalid status value');
            }
            $updateFields[] = 'status = :status';
            $params[':status'] = $data['status'];
        }
        
        if (empty($updateFields)) {
            sendError('No fields to update');
        }
        
        $query = "UPDATE todos SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        
        // Get the updated todo
        $getTodoQuery = "SELECT * FROM todos WHERE id = :id";
        $getTodoStmt = $db->prepare($getTodoQuery);
        $getTodoStmt->execute([':id' => $data['id']]);
        $todo = $getTodoStmt->fetch();
        
        sendResponse([
            'success' => true,
            'data' => $todo,
            'message' => 'Todo updated successfully'
        ]);
        
    } catch (Exception $e) {
        sendError('Failed to update todo: ' . $e->getMessage(), 500);
    }
}

/**
 * Delete a todo
 */
function deleteTodo() {
    try {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data || !isset($data['id'])) {
            sendError('Todo ID is required');
        }
        
        $db = getDbConnection();
        
        // Check if todo exists
        $checkQuery = "SELECT id FROM todos WHERE id = :id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->execute([':id' => $data['id']]);
        
        if (!$checkStmt->fetch()) {
            sendError('Todo not found', 404);
        }
        
        $query = "DELETE FROM todos WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->execute([':id' => $data['id']]);
        
        sendResponse([
            'success' => true,
            'message' => 'Todo deleted successfully'
        ]);
        
    } catch (Exception $e) {
        sendError('Failed to delete todo: ' . $e->getMessage(), 500);
    }
}

// Route the request based on HTTP method
try {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            getTodos();
            break;
        case 'POST':
            createTodo();
            break;
        case 'PUT':
            updateTodo();
            break;
        case 'DELETE':
            deleteTodo();
            break;
        default:
            sendError('Method not allowed', 405);
    }
} catch (Exception $e) {
    sendError('Server error: ' . $e->getMessage(), 500);
} 