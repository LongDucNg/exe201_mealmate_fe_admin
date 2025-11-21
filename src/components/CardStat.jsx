const accentMap = { // Bảng màu chữ
  brand: 'text-brand', // Màu vàng
  success: 'text-success', // Màu xanh
  danger: 'text-danger', // Màu đỏ
  charcoal: 'text-charcoal', // Màu đen
} // Kết thúc map

const CardStat = ({ label, value, accent = 'brand' }) => { // Component card thống kê
  return ( // JSX
    <div className="bg-white rounded-[32px] shadow-card px-8 py-7 flex flex-col gap-3 border border-gray-100"> {/* Card */}
      <p className="text-base font-medium text-gray-500">{label}</p> {/* Nhãn */}
      <p className={`text-4xl font-semibold tracking-tight ${accentMap[accent] ?? 'text-charcoal'}`}>{value}</p> {/* Giá trị */}
    </div> // Kết thúc card
  ) // Kết thúc JSX
} // Kết thúc component

export default CardStat // Xuất card

