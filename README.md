# Outsourced Todo - Professional Task Management

A modern, responsive todo application built with React, TypeScript, and Vite. Perfect for managing outsourced projects and tasks with a clean user interface featuring navy blue, white, and black color scheme, comprehensive task management capabilities, and localStorage persistence (no backend required).

![Outsourced Todo Preview](https://via.placeholder.com/800x400/1e40af/white?text=Outsourced+Todo+App)

## 🚀 Features

### Core Functionality
- ✅ **Add and view tasks** - Create new todos with title, description, and priority
- ✅ **Delete tasks** - Remove completed or unwanted tasks
- ✅ **Complete tasks** - Mark tasks as completed with visual feedback
- ✅ **Set task priorities** - Organize tasks with High, Medium, and Low priorities
- ✅ **Sort by priority and name** - Flexible sorting options for better organization
- ✅ **View statistics** - Track total and completed task counts with visual progress

### Advanced Features
- 🔍 **Smart Search** - Find tasks by title or description
- 🎯 **Advanced Filtering** - Filter by status (pending/completed) and priority level
- 📊 **Real-time Statistics** - Visual progress tracking with motivational messages
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🎨 **Professional UI** - Clean, modern interface with consistent design
- ⚡ **Real-time Updates** - Instant feedback on all operations
- 🧪 **Comprehensive Testing** - Unit tests for all utility functions

## 🛠️ Technical Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Full type safety and excellent developer experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for consistent styling
- **Lucide React** - Beautiful, customizable icons
- **Vitest** - Fast unit testing framework

### Backend
- **PHP 8+** - Server-side API with modern PHP features
- **SQLite** - Lightweight, serverless database
- **RESTful API** - Clean API design with proper HTTP methods
- **CORS Support** - Cross-origin resource sharing for frontend integration

### Development Tools
- **ESLint** - Code linting for consistent code quality
- **TypeScript Compiler** - Static type checking
- **PostCSS** - CSS processing with Tailwind CSS
- **Autoprefixer** - Automatic vendor prefixing

## 🎨 Design Features

### Color Scheme
- **Primary Navy**: `#1e40af` - Used for primary actions and branding
- **Clean White**: `#ffffff` - Background and card elements
- **Professional Black**: `#000000` - Text and accents
- **Semantic Colors**: Red (high priority), Yellow (medium), Green (low)

### Typography
- **Inter Font Family** - Modern, readable typography
- **Consistent Sizing** - Hierarchical text sizes for better readability
- **Proper Contrast** - WCAG compliant color contrast ratios

### Responsive Design
- **Mobile First** - Optimized for mobile devices
- **Tablet Friendly** - Adapted layouts for medium screens
- **Desktop Enhanced** - Full-featured desktop experience

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** (version 8 or higher)
- **PHP** (version 8.0 or higher)
- **SQLite3** (usually included with PHP)
- **Web Server** (Apache, Nginx, or built-in PHP server)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-app
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Set Up the Backend

#### Option A: Using Built-in PHP Server (Recommended for Development)

```bash
# Navigate to the API directory
cd api

# Start PHP development server
php -S localhost:8000
```

#### Option B: Using Apache/Nginx

1. Copy the `api` folder to your web server document root
2. Ensure your web server has PHP enabled
3. Make sure the `data` directory is writable by the web server

### 4. Start the Frontend Development Server

```bash
# In a new terminal, from the project root
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api

## 🧪 Running Tests

### Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Backend Testing

You can test the API endpoints using curl or any API testing tool:

```bash
# Get all todos
curl http://localhost:8000/api/todos.php

# Create a new todo
curl -X POST http://localhost:8000/api/todos.php \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"Test description","priority":"high"}'

# Update a todo
curl -X PUT http://localhost:8000/api/todos.php \
  -H "Content-Type: application/json" \
  -d '{"id":"1","status":"completed"}'

# Delete a todo
curl -X DELETE http://localhost:8000/api/todos.php \
  -H "Content-Type: application/json" \
  -d '{"id":"1"}'
```

## 📁 Project Structure

```
todo-app/
├── api/                          # PHP Backend
│   ├── config/
│   │   └── database.php         # Database configuration
│   ├── database/
│   │   └── schema.sql           # Database schema
│   └── todos.php                # Main API endpoint
├── data/                        # SQLite database storage (auto-created)
├── public/                      # Static assets
├── src/                         # React frontend source
│   ├── __tests__/              # Test files
│   │   └── utils.test.ts       # Utility function tests
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── button.tsx      # Button component
│   │   │   ├── input.tsx       # Input/Textarea components
│   │   │   └── toast.tsx       # Toast notification system
│   │   ├── TodoApp.tsx         # Main application component
│   │   ├── TodoForm.tsx        # Todo creation/editing form
│   │   ├── TodoList.tsx        # Todo list and item display
│   │   ├── TodoStats.tsx       # Statistics display
│   │   └── TodoFilters.tsx     # Filtering and sorting controls
│   ├── contexts/               # React contexts
│   │   └── TodoContext.tsx     # Global todo state management
│   ├── lib/                    # Utility libraries
│   │   └── utils.ts            # Helper functions
│   ├── services/               # API services
│   │   └── api.ts              # API communication layer
│   ├── types/                  # TypeScript type definitions
│   │   └── todo.ts             # Todo-related types
│   ├── App.tsx                 # Root app component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── vitest.config.ts            # Vitest testing configuration
```

## 🔧 Configuration

### Frontend Configuration

The frontend can be configured through environment variables:

```env
# .env.local
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend Configuration

Database configuration is handled in `api/config/database.php`. The SQLite database is automatically created in the `data/` directory.

## 📱 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### GET /todos.php
Get all todos with optional filtering and sorting.

**Query Parameters:**
- `status` - Filter by status (pending/completed)
- `priority` - Filter by priority (high/medium/low)
- `search` - Search in title and description
- `sort` - Sort field (title/priority/created_at/updated_at)
- `direction` - Sort direction (asc/desc)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "stats": {
    "total": 5,
    "completed": 2,
    "pending": 3,
    "byPriority": {
      "high": 2,
      "medium": 2,
      "low": 1
    }
  }
}
```

#### POST /todos.php
Create a new todo.

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Optional description",
  "priority": "high"
}
```

#### PUT /todos.php
Update an existing todo.

**Request Body:**
```json
{
  "id": "1",
  "title": "Updated title",
  "status": "completed"
}
```

#### DELETE /todos.php
Delete a todo.

**Request Body:**
```json
{
  "id": "1"
}
```

## 🎯 Best Practices Implemented

### Code Quality
- **TypeScript Strict Mode** - Full type safety
- **Comprehensive Documentation** - Every function and component documented
- **Consistent Naming** - Clear, descriptive variable and function names
- **Error Handling** - Robust error handling throughout the application
- **Component Separation** - Single responsibility principle

### Performance
- **React.memo** - Optimized re-rendering
- **Debounced Search** - Efficient search functionality
- **Lazy Loading** - Code splitting for better performance
- **Optimized Bundles** - Tree shaking and minification

### User Experience
- **Loading States** - Visual feedback during operations
- **Error Messages** - Clear, actionable error messages
- **Success Feedback** - Confirmation of successful actions
- **Responsive Design** - Works on all devices
- **Accessibility** - Keyboard navigation and screen reader support

### Security
- **Input Validation** - Both frontend and backend validation
- **SQL Injection Prevention** - Prepared statements
- **XSS Protection** - Proper data sanitization
- **CORS Configuration** - Secure cross-origin requests

## 🔄 Development Workflow

### Making Changes

1. **Frontend Changes**: Edit files in `src/`, changes will hot-reload automatically
2. **Backend Changes**: Edit PHP files in `api/`, restart PHP server if needed
3. **Database Changes**: Modify `api/database/schema.sql` and restart backend

### Building for Production

```bash
# Build the frontend
npm run build

# Preview the production build
npm run preview
```

### Linting and Formatting

```bash
# Lint TypeScript/React code
npm run lint

# Type checking
npx tsc --noEmit
```

## 🚀 Deployment

### Frontend Deployment

The built files from `dist/` can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Backend Deployment

The PHP API can be deployed to any PHP hosting service:
- Shared hosting with PHP support
- VPS with Apache/Nginx
- Cloud platforms (AWS, Google Cloud, Azure)

Make sure the hosting environment supports:
- PHP 8.0+
- SQLite
- Write permissions for the data directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Lucide for beautiful icons
- Vite for the lightning-fast build tool
- The open-source community for inspiration and tools

---

**Built with ❤️ for professional task management** 