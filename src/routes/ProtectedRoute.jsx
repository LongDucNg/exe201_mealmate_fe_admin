import { Navigate } from 'react-router-dom' // Import Navigate để redirect
import { useAuth } from '../context/AuthContext.jsx' // Hook auth

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth() // Kiểm tra trạng thái đăng nhập

  if (!isAuthenticated) {
    return <Navigate to="/login" replace /> // Nếu chưa login → về login
  }

  return children // Nếu đã login → render nội dung
}

export default ProtectedRoute // Xuất component

