import { RouterProvider } from 'react-router-dom' // Import RouterProvider để cung cấp router
import router from './routes.jsx' // Import router đã cấu hình

const App = () => { // Định nghĩa component App
  return <RouterProvider router={router} /> // Render toàn bộ app thông qua RouterProvider
} // Kết thúc component App

export default App // Xuất component App

