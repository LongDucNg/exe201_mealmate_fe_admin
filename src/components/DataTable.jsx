const DataTable = ({ columns, rows }) => { // Component bảng tái sử dụng
  // Đảm bảo rows luôn là array để tránh lỗi rows.map is not a function
  const safeRows = Array.isArray(rows) ? rows : [] // Validate rows là array

  return ( // JSX
    <div className="bg-white rounded-[32px] shadow-card border border-gray-100"> {/* Vỏ bảng */}
      <div className="overflow-x-auto"> {/* Cho phép cuộn ngang */}
        <table className="min-w-full divide-y divide-gray-100"> {/* Bảng */}
          <thead className="bg-smoke/80"> {/* Header */}
            <tr> {/* Hàng header */}
              {columns.map((column) => ( // Lặp từng cột
                <th
                  key={column.key} // Key React
                  className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]"
                >
                  {column.label} {/* Nhãn cột */}
                </th>
              ))} {/* Kết thúc lặp cột */}
            </tr> {/* Kết thúc hàng header */}
          </thead> {/* Kết thúc thead */}
          <tbody className="divide-y divide-gray-50"> {/* Thân bảng */}
            {safeRows.map((row) => ( // Lặp hàng dữ liệu
              <tr key={row._id ?? row.id ?? row.name} className="hover:bg-lilac/30 transition rounded-3xl"> {/* Hàng */}
                {columns.map((column) => ( // Lặp cột trên hàng
                  <td key={column.key} className="px-8 py-5 text-base text-charcoal whitespace-nowrap"> {/* Ô */}
                    {column.render ? column.render(row[column.key], row) : row[column.key]} {/* Giá trị */}
                  </td>
                ))} {/* Kết thúc lặp cột */}
              </tr>
            ))} {/* Kết thúc lặp hàng */}
            <tr>
              <td colSpan={columns.length} className="px-8 pt-4 pb-2 text-center text-xs uppercase tracking-[0.3em] text-gray-400">
                © {new Date().getFullYear()} MealMate · Bảo mật & điều khoản
              </td>
            </tr>
          </tbody> {/* Kết thúc tbody */}
        </table> {/* Kết thúc table */}
      </div> {/* Kết thúc overflow */}
    </div> // Kết thúc vỏ
  ) // Kết thúc JSX
} // Kết thúc component

export default DataTable // Xuất DataTable

