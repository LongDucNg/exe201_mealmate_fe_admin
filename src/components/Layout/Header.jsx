import { FiLogOut } from 'react-icons/fi' // Import icon logout
import { useAuth } from '../../context/AuthContext.jsx' // Hook auth
import { useNavigate } from 'react-router-dom' // Hook điều hướng

const Header = ({ title, subtitle }) => { // Component header nhận tiêu đề
  const { profile, logout } = useAuth() // Lấy thông tin user và hàm logout
  const navigate = useNavigate() // Hook điều hướng

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return ( // JSX trả về
    <header className="flex justify-between items-center pb-6 border-b border-gray-100"> {/* Thanh header */}
      <div> {/* Khối tiêu đề */}
        <p className="uppercase text-xs text-gray-400 tracking-widest">{subtitle}</p> {/* Subtitle */}
        <h1 className="text-3xl font-semibold text-charcoal mt-1">{title}</h1> {/* Title */}
      </div> {/* Kết thúc khối tiêu đề */}
      <div className="flex items-center gap-3"> {/* Khối thông tin user */}
        <button
          className="p-3 rounded-full border border-gray-200 text-gray-500 hover:text-charcoal transition"
          onClick={handleLogout}
        >
          <FiLogOut className="text-xl" /> {/* Icon logout */}
        </button> {/* Nút đăng xuất */}
      </div> {/* Kết thúc khối user */}
    </header> // Kết thúc header
  ) // Kết thúc JSX
} // Kết thúc component

export default Header // Xuất component Header

