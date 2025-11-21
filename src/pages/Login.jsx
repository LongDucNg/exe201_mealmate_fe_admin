import { useState } from 'react' // Hook state
import { useNavigate } from 'react-router-dom' // Import hook điều hướng
import logo from '../assets/MealMate Logo.png' // Import logo PNG mới
import apiClient from '../lib/apiClient.js' // HTTP client
import { useAuth } from '../context/AuthContext.jsx' // Hook auth

const Login = () => { // Component login
  const navigate = useNavigate() // Hook điều hướng
  const { login } = useAuth() // Lấy hàm login từ context
  const [formValues, setFormValues] = useState({ username: '', password: '' }) // State form
  const [isSubmitting, setIsSubmitting] = useState(false) // Trạng thái submit
  const [error, setError] = useState(null) // Thông báo lỗi

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value })) // Cập nhật state
  }

  const handleSubmit = async (event) => { // Hàm submit form
    event.preventDefault() // Ngăn reload trang
    setError(null) // reset lỗi
    setIsSubmitting(true) // bật loading
    try {
      const response = await apiClient.post('/users/login', formValues) // Gọi API login
      const { accessToken, refreshToken } = response.data // Lấy token
      login({ accessToken, refreshToken }, { username: formValues.username }) // Lưu context
      navigate('/admin/users') // Chuyển sang dashboard
    } catch (err) {
      const message = err.response?.data?.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.'
      setError(message) // Hiển thị lỗi
    } finally {
      setIsSubmitting(false) // Tắt loading
    }
  } // Kết thúc submit

  return ( // JSX
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f9e9c6,#ffffff_55%)] flex items-center justify-center px-6 py-16">
      {/* Nền gradient */}
      <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-card px-16 py-14 space-y-10 text-center border border-gray-100">
        {/* Khối form */}
        <div className="space-y-5">
          <img src={logo} alt="MealMate" className="w-36 mx-auto drop-shadow-lg" /> {/* Logo lớn */}
          <h1 className="text-5xl font-semibold text-charcoal">Đăng nhập</h1> {/* Title */}
          <p className="text-gray-500 text-base">
            Truy cập bảng điều khiển để quản lý người dùng và số liệu MealMate
          </p> {/* Mô tả ngắn */}
        </div> {/* Kết thúc tiêu đề */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left"> {/* Form */}
          <div className="text-left space-y-2"> {/* Input email */}
            <label className="text-base font-semibold text-gray-700">Email</label> {/* Nhãn */}
            <input
              type="text"
              name="username"
              required
              placeholder="Nhập email/username"
              value={formValues.username}
              onChange={handleChange}
              className="w-full rounded-[32px] border border-[#dfe4ff] px-6 py-5 bg-[#eaf1ff] text-lg text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand/60 placeholder:text-gray-400"
            /> {/* ô nhập */}
          </div> {/* Kết thúc email */}
          <div className="text-left space-y-2"> {/* Input mật khẩu */}
            <label className="text-base font-semibold text-gray-700">Mật khẩu</label> {/* Nhãn */}
            <input
              type="password"
              name="password"
              required
              placeholder="Nhập mật khẩu"
              value={formValues.password}
              onChange={handleChange}
              className="w-full rounded-[32px] border border-[#dfe4ff] px-6 py-5 bg-[#eaf1ff] text-lg text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand/60 placeholder:text-gray-400"
            /> {/* ô nhập */}
          </div> {/* Kết thúc password */}
          <div className="flex items-start gap-3 text-sm text-gray-500 bg-[#f7f7fb] rounded-3xl p-5 border border-gray-100">
            <input type="checkbox" defaultChecked className="mt-1 accent-brand" /> {/* Checkbox */}
            <span>Tôi xác nhận rằng tôi đã đọc và đồng ý với Điều khoản & Chính sách bảo mật.</span> {/* Nội dung */}
          </div> {/* Kết thúc checkbox */}
          {error && <p className="text-danger text-sm">{error}</p>} {/* Hiển thị lỗi */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand text-charcoal font-semibold rounded-[32px] py-5 text-lg shadow-card hover:bg-brandDark transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button> {/* Nút submit */}
        </form> {/* Kết thúc form */}
      </div> {/* Kết thúc khối */}
    </div> // Kết thúc trang
  ) // Kết thúc JSX
} // Kết thúc component

export default Login // Xuất component

