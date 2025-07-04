import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Application entry point
 * 
 * This file initializes the React application and renders the App component
 * into the root DOM element.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 