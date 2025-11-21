import React from 'react' // Import React để dùng JSX
import ReactDOM from 'react-dom/client' // Import API createRoot
import App from './App.jsx' // Import component App chính
import './styles/index.css' // Import stylesheet toàn cục
import { AuthProvider } from './context/AuthContext.jsx' // Import AuthProvider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // React Query

const queryClient = new QueryClient() // Khởi tạo QueryClient

ReactDOM.createRoot(document.getElementById('root')).render( // Khởi tạo root và render
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> {/* Cung cấp query client */}
      <AuthProvider> {/* Cung cấp context auth */}
        <App /> {/* Render App chính */}
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
) // Kết thúc render

