import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/style.css'
import App from './App'
// Import test utilities for development
import './utils/testApi'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
