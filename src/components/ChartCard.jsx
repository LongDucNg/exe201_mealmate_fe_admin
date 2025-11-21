const ChartCard = ({ title, children }) => { // Component bao biểu đồ
  return ( // JSX
    <div className="bg-white rounded-3xl shadow-card p-6 flex-1"> {/* Khung card */}
      <h3 className="text-lg font-semibold text-charcoal mb-4">{title}</h3> {/* Tiêu đề */}
      <div className="h-60">{children}</div> {/* Vùng chứa biểu đồ */}
    </div> // Kết thúc card
  ) // Kết thúc JSX
} // Kết thúc component

export default ChartCard // Xuất ChartCard

