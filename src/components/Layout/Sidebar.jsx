import { NavLink } from 'react-router-dom' // Import NavLink để tạo menu có trạng thái
import { FiUsers, FiActivity } from 'react-icons/fi' // Import icon menu
import logo from '../../assets/MealMate Logo.png' // Import logo MealMate dạng PNG

const MealIcon = ({ className }) => ( // Icon svg nội tuyến
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 12.5C2 17.1944 5.80558 21 10.5 21C15.1944 21 19 17.1944 19 12.5H2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M7 4C7 5.33333 6.6 6 5.8 7C5 8 5 8.66667 5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 4C11 5.33333 10.6 6 9.8 7C9 8 9 8.66667 9 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 4C15 5.33333 14.6 6 13.8 7C13 8 13 8.66667 13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 10C4 15.5228 8.47715 20 14 20C19.5228 20 24 15.5228 24 10H4Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const menuItems = [ // Danh sách menu hiển thị bên trái
  { key: 'users', label: 'Quản lý tài khoản', path: '/admin/users', icon: FiUsers }, // Mục quản lý user
  { key: 'meals', label: 'Quản lý bữa ăn', path: '/manager/meals', icon: MealIcon }, // Mục meals
  { key: 'frequency', label: 'Doanh thu', path: '/admin/frequency', icon: FiActivity }, // Mục báo cáo doanh thu
] // Kết thúc danh sách menu

const Sidebar = () => { // Component Sidebar chính
  return ( // Bắt đầu JSX
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col justify-between py-12 px-10"> {/* Thanh sidebar */}
      <div> {/* Vùng logo và menu */}
        <div className="flex items-center gap-4 mb-12"> {/* Logo */}
          <img src={logo} alt="MealMate" className="w-14 h-14" /> {/* Ảnh logo */}
          <div> {/* Nhãn thương hiệu */}
            <p className="text-2xl font-semibold text-charcoal">MealMate</p> {/* Tên */}
            <span className="text-sm text-gray-400">Plan your best meals</span> {/* Tagline */}
          </div> {/* Kết thúc nhãn */}
        </div> {/* Kết thúc logo */}
        <nav className="flex flex-col gap-3"> {/* Danh sách menu */}
          {menuItems.map((item) => ( // Lặp từng mục
            <NavLink
              key={item.key} // Key React
              to={item.path} // Đường dẫn
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition ${
                  isActive ? 'bg-lilac text-charcoal shadow-card' : 'text-gray-500 hover:text-charcoal'
                }`
              } // Hàm tính class theo trạng thái
            >
              {item.icon && <item.icon className="text-2xl" />} {/* Icon menu */}
              <span>{item.label}</span> {/* Nhãn menu */}
            </NavLink>
          ))} {/* Kết thúc lặp */}
        </nav> {/* Kết thúc nav */}
      </div> {/* Kết thúc vùng trên */}
      <p className="text-xs text-gray-400 leading-5">
        © {new Date().getFullYear()} MealMate · Bảo mật & điều khoản
      </p> {/* Ghi chú bản quyền */}
    </aside> // Kết thúc aside
  ) // Kết thúc JSX
} // Kết thúc component

export default Sidebar // Xuất component Sidebar

