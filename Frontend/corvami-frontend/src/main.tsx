import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { CartProvider } from './contexts/CartContext.tsx'
import { seedDatabase } from './seed'

// Exponer seed en la consola para desarrollo
if (import.meta.env.DEV) {
  (window as any).seedDatabase = seedDatabase;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ThemeProvider>
  </StrictMode>,
)
