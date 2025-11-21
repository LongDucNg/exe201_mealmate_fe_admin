/** @type {import('tailwindcss').Config} */ // Khai báo loại cấu hình cho Tailwind
export default { // Xuất cấu hình chính
  content: ['./index.html', './src/**/*.{js,jsx}'], // Khai báo phạm vi quét lớp Tailwind
  theme: { // Phần định nghĩa theme
    extend: { // Mở rộng token mặc định
      fontFamily: { // Cấu hình font tuỳ chỉnh
        body: ['Inter', 'sans-serif'], // Chọn font Inter cho toàn bộ app
      }, // Kết thúc fontFamily
      colors: { // Định nghĩa bảng màu theo thiết kế
        brand: '#F5C76A', // Màu vàng chủ đạo
        brandDark: '#E0A94B', // Màu vàng đậm cho hover
        lilac: '#F4EFFA', // Màu nền tím nhạt
        smoke: '#F5F5F5', // Màu nền sáng
        charcoal: '#1F1F1F', // Màu chữ chính
        success: '#34C759', // Màu trạng thái active
        danger: '#FF6B6B', // Màu trạng thái lỗi
      }, // Kết thúc colors
      boxShadow: { // Tạo shadow mềm
        card: '0 30px 80px rgba(0,0,0,0.05)', // Shadow cho card
      }, // Kết thúc boxShadow
    }, // Kết thúc extend
  }, // Kết thúc theme
  plugins: [], // Không dùng plugin bổ sung
} // Kết thúc file cấu hình
