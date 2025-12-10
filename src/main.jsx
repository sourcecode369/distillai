import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './i18n/config'
import './index.css'
import App from './App.jsx'

// Create a QueryClient instance with default options
// staleTime: 45 seconds - data is considered fresh for 45 seconds
// This prevents unnecessary refetches when switching routes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 45 * 1000, // 45 seconds
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
