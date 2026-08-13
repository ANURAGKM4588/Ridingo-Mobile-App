import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DriverApp } from './DriverApp.tsx'

const isDriverMode = 
  window.location.search.toLowerCase().includes('driver') || 
  window.location.pathname.toLowerCase().includes('driver') ||
  window.location.hash.toLowerCase().includes('driver') ||
  localStorage.getItem('ridingo_mode') === 'driver';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDriverMode ? <DriverApp /> : <App />}
  </StrictMode>,
)


