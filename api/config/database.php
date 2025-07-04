<?php
/**
 * Database Configuration
 * 
 * This file contains the database configuration and connection setup
 * for the todo application using SQLite.
 */

class Database {
    private $dbPath;
    private $connection;
    
    /**
     * Constructor - initializes the database path
     */
    public function __construct() {
        $this->dbPath = __DIR__ . '/../../data/todos.db';
        
        // Create data directory if it doesn't exist
        $dataDir = dirname($this->dbPath);
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
    }
    
    /**
     * Get database connection
     * 
     * @return PDO Database connection object
     * @throws Exception If connection fails
     */
    public function getConnection() {
        if ($this->connection === null) {
            try {
                // Create SQLite connection
                $this->connection = new PDO(
                    'sqlite:' . $this->dbPath,
                    null,
                    null,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]
                );
                
                // Enable foreign key constraints
                $this->connection->exec('PRAGMA foreign_keys = ON');
                
                // Initialize database schema
                $this->initializeSchema();
                
            } catch (PDOException $e) {
                throw new Exception('Database connection failed: ' . $e->getMessage());
            }
        }
        
        return $this->connection;
    }
    
    /**
     * Initialize database schema
     * 
     * @throws Exception If schema initialization fails
     */
    private function initializeSchema() {
        try {
            $schemaFile = __DIR__ . '/../database/schema.sql';
            
            if (!file_exists($schemaFile)) {
                throw new Exception('Schema file not found: ' . $schemaFile);
            }
            
            $schema = file_get_contents($schemaFile);
            
            if ($schema === false) {
                throw new Exception('Unable to read schema file');
            }
            
            // Execute schema SQL
            $this->connection->exec($schema);
            
        } catch (Exception $e) {
            throw new Exception('Schema initialization failed: ' . $e->getMessage());
        }
    }
    
    /**
     * Check if database exists and is accessible
     * 
     * @return bool True if database is accessible
     */
    public function isAccessible() {
        try {
            $this->getConnection();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    /**
     * Get database file path
     * 
     * @return string Database file path
     */
    public function getDbPath() {
        return $this->dbPath;
    }
    
    /**
     * Close database connection
     */
    public function close() {
        $this->connection = null;
    }
}

// Global function to get database instance
function getDatabase() {
    static $database = null;
    
    if ($database === null) {
        $database = new Database();
    }
    
    return $database;
}

// Global function to get database connection
function getDbConnection() {
    return getDatabase()->getConnection();
} 