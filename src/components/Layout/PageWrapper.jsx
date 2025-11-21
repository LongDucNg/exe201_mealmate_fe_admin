import Sidebar from './Sidebar.jsx' // Import sidebar
import Header from './Header.jsx' // Import header

const PageWrapper = ({ title, subtitle, children }) => { // Component bố cục trang
  return ( // JSX
    <div className="min-h-screen bg-smoke flex"> {/* Nền tổng */}
      <Sidebar /> {/* Sidebar */}
      <main className="flex-1 bg-lilac"> {/* Nội dung */}
        <div className="p-10 space-y-8"> {/* Bao nội dung với padding */}
          <Header title={title} subtitle={subtitle} /> {/* Header */}
          <section>{children}</section> {/* Slot nội dung */}
        </div> {/* Kết thúc bao */}
      </main> {/* Kết thúc main */}
    </div> // Kết thúc wrapper
  ) // Kết thúc JSX
} // Kết thúc component

export default PageWrapper // Xuất PageWrapper

