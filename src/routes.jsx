import { createBrowserRouter, Navigate } from 'react-router-dom' // Import API router và Navigate
import Login from './pages/Login.jsx' // Import trang đăng nhập
import AdminUsers from './pages/AdminUsers.jsx' // Import trang quản lý người dùng
import ManagerMeals from './pages/ManagerMeals.jsx' // Import trang quản lý món ăn
import AdminFrequency from './pages/AdminFrequency.jsx' // Import trang tần suất sử dụng
import ProtectedRoute from './routes/ProtectedRoute.jsx' // Wrapper bảo vệ route

const router = createBrowserRouter([ // Khởi tạo router với danh sách route
  { path: '/', element: <Navigate to="/login" replace /> }, // Điều hướng gốc về login
  { path: '/login', element: <Login /> }, // Trang đăng nhập
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute>
        <AdminUsers />
      </ProtectedRoute>
    ),
  }, // Trang admin quản lý user
  {
    path: '/manager/meals',
    element: (
      <ProtectedRoute>
        <ManagerMeals />
      </ProtectedRoute>
    ),
  }, // Trang manager quản lý món ăn
  {
    path: '/admin/frequency',
    element: (
      <ProtectedRoute>
        <AdminFrequency />
      </ProtectedRoute>
    ),
  }, // Trang admin tần suất sử dụng
]) // Kết thúc định nghĩa router

export default router // Xuất router để App dùng

