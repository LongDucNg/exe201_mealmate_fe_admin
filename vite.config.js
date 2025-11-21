import { defineConfig } from 'vite' // Import helper để định nghĩa cấu hình Vite
import react from '@vitejs/plugin-react' // Import plugin React để hỗ trợ JSX và Fast Refresh
export default defineConfig({ // Xuất cấu hình dưới dạng đối tượng
  plugins: [react()], // Kích hoạt plugin React trong Vite
}) // Xuất cấu hình để Vite sử dụng

