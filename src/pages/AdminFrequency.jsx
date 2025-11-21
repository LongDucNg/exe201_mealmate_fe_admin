import { useMemo, useState } from 'react' // Import hook state và memo
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts' // Import Recharts cho biểu đồ
import PageWrapper from '../components/Layout/PageWrapper.jsx' // Bố cục tiêu chuẩn
import CardStat from '../components/CardStat.jsx' // Card hiển thị KPI
import ChartCard from '../components/ChartCard.jsx' // Card chứa biểu đồ
import DataTable from '../components/DataTable.jsx' // Bảng dữ liệu
import useRevenueStats from '../hooks/useRevenueStats.js' // Hook gọi API doanh thu
import useUserStats from '../hooks/useUserStats.js' // Hook gọi API thống kê user

const periodOptions = [ // Danh sách chu kỳ
  { value: 'week', label: 'Tuần này' }, // Option tuần
  { value: 'month', label: 'Tháng này' }, // Option tháng
  { value: 'year', label: 'Năm nay' }, // Option năm
] // Kết thúc options

const formatCurrency = (value) => // Hàm format tiền VND
  (typeof value === 'number' ? value : 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) // Trả về chuỗi tiền

const formatNumber = (value) => // Hàm format số
  (typeof value === 'number' ? value : 0).toLocaleString('vi-VN') // Trả về chuỗi số

const AdminFrequency = () => { // Component trang báo cáo
  const [period, setPeriod] = useState('week') // State chu kỳ

  const {
    data: revenueData,
    isLoading: isRevenueLoading,
    isError: isRevenueError,
    error: revenueError,
  } = useRevenueStats(period) // Hook gọi doanh thu

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useUserStats(period) // Hook gọi user stats

  const isLoading = isRevenueLoading || isUserLoading // Tổng trạng thái loading

  const overviewCards = useMemo(() => { // Memo dữ liệu KPI chính
    const totalRevenue = revenueData?.overview?.totalRevenue ?? 0 // Tổng doanh thu
    const totalTransactions = revenueData?.overview?.totalTransactions ?? 0 // Tổng giao dịch
    return [ // Trả về danh sách KPI
      { id: 'revenue', label: 'Tổng doanh thu', value: formatCurrency(totalRevenue) }, // Card 1
      { id: 'transactions', label: 'Số giao dịch', value: formatNumber(totalTransactions) }, // Card 2
    ] // Kết thúc array
  }, [revenueData]) // Phụ thuộc doanh thu

  const timeBreakdown = revenueData?.byTime ?? {} // Dữ liệu byTime
  const packageBreakdown = revenueData?.byPackage ?? {} // Dữ liệu theo gói

  const packageCards = useMemo(() => { // Memo dữ liệu gói
    const monthly = packageBreakdown.monthly ?? {} // Gói monthly
    const trial = packageBreakdown.trial ?? {} // Gói trial
    const totalRevenue = (monthly.revenue ?? 0) + (trial.revenue ?? 0) // Tổng revenue
    const totalTransactions = (monthly.transactions ?? 0) + (trial.transactions ?? 0) // Tổng giao dịch
    const calcPercent = (part, total) => (total > 0 ? ((part / total) * 100).toFixed(1) : '0.0') // Hàm tính %
    return [ // Mảng card
      {
        id: 'monthly',
        title: 'Gói Monthly',
        revenue: formatCurrency(monthly.revenue ?? 0),
        transactions: formatNumber(monthly.transactions ?? 0),
        revenuePercent: calcPercent(monthly.revenue ?? 0, totalRevenue),
        transactionPercent: calcPercent(monthly.transactions ?? 0, totalTransactions),
      }, // Card monthly
      {
        id: 'trial',
        title: 'Gói Trial',
        revenue: formatCurrency(trial.revenue ?? 0),
        transactions: formatNumber(trial.transactions ?? 0),
        revenuePercent: calcPercent(trial.revenue ?? 0, totalRevenue),
        transactionPercent: calcPercent(trial.transactions ?? 0, totalTransactions),
      }, // Card trial
    ] // Kết thúc array
  }, [packageBreakdown]) // Phụ thuộc dữ liệu gói

  const timeSeriesRows = useMemo(() => { // Memo bảng time series
    return (revenueData?.timeSeries ?? []).map((item, index) => ({ // Map từng item
      id: `${item.period}-${index}`, // ID hàng
      period: item.period, // Giai đoạn
      revenue: formatCurrency(item.revenue ?? 0), // Doanh thu
      transactions: formatNumber(item.transactions ?? 0), // Giao dịch
      monthlyRevenue: formatCurrency(item.monthly?.revenue ?? 0), // Doanh thu monthly
      monthlyTransactions: formatNumber(item.monthly?.transactions ?? 0), // Giao dịch monthly
      trialRevenue: formatCurrency(item.trial?.revenue ?? 0), // Doanh thu trial
      trialTransactions: formatNumber(item.trial?.transactions ?? 0), // Giao dịch trial
    })) // Kết thúc map
  }, [revenueData]) // Phụ thuộc doanh thu

  const timeSeriesColumns = [ // Định nghĩa cột bảng
    { key: 'period', label: 'Chu kỳ' }, // Cột chu kỳ
    { key: 'revenue', label: 'Doanh thu' }, // Cột revenue
    { key: 'transactions', label: 'Giao dịch' }, // Cột giao dịch
    { key: 'monthlyRevenue', label: 'Monthly (₫)' }, // Cột monthly revenue
    { key: 'monthlyTransactions', label: 'Monthly (txn)' }, // Cột monthly txn
    { key: 'trialRevenue', label: 'Trial (₫)' }, // Cột trial revenue
    { key: 'trialTransactions', label: 'Trial (txn)' }, // Cột trial txn
  ] // Kết thúc cột

  const pieData = useMemo(() => { // Pie chart user
    return [
      {
        name: 'Free',
        value: userData?.pieChart?.free?.count ?? 0,
        color: '#F5C76A',
        percentage: userData?.pieChart?.free?.percentage ?? 0,
      }, // Free slice
      {
        name: 'Premium',
        value: userData?.pieChart?.premium?.count ?? 0,
        color: '#50C878',
        percentage: userData?.pieChart?.premium?.percentage ?? 0,
      }, // Premium slice
    ] // Kết thúc array
  }, [userData]) // Phụ thuộc dữ liệu user

  const totalUsers = useMemo( // Tổng user
    () => pieData.reduce((sum, item) => sum + (item.value ?? 0), 0), // Cộng giá trị
    [pieData], // Phụ thuộc pieData
  )

  const barData = useMemo(() => { // Bar chart user
    return [
      {
        category: 'Free',
        value: userData?.barChart?.free ?? 0,
      }, // Cột free
      {
        category: 'Premium',
        value: userData?.barChart?.premium ?? 0,
      }, // Cột premium
    ] // Kết thúc array
  }, [userData]) // Phụ thuộc user data

  const handlePeriodChange = (event) => { // Handler đổi chu kỳ
    setPeriod(event.target.value) // Cập nhật period
  } // Kết thúc handler

  return ( // JSX
    <PageWrapper title="Administrator" subtitle="Báo cáo doanh thu & người dùng"> {/* Khung trang */}
      <div className="space-y-6"> {/* Nội dung tổng */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold text-charcoal">Tổng quan kinh doanh</p>
            <p className="text-sm text-gray-500">Nguồn dữ liệu trực tiếp từ API</p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="period" className="text-sm text-gray-500">
              Chu kỳ:
            </label>
            <select
              id="period"
              value={period}
              onChange={handlePeriodChange}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:border-brand"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isRevenueError && ( // Hiển thị lỗi doanh thu
          <p className="text-danger bg-danger/10 border border-danger/30 rounded-2xl p-4">
            Không tải được doanh thu: {revenueError?.message ?? 'Lỗi không xác định'}
          </p>
        )}

        {isUserError && ( // Hiển thị lỗi user
          <p className="text-danger bg-danger/10 border border-danger/30 rounded-2xl p-4">
            Không tải được thống kê user: {userError?.message ?? 'Lỗi không xác định'}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* KPI tổng */}
          {overviewCards.map((card) => (
            <CardStat key={card.id} label={card.label} value={card.value} />
          ))}
        </div> {/* Kết thúc KPI */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Phân rã theo thời gian */}
          {['today', 'thisMonth', 'thisYear'].map((key) => {
            const item = timeBreakdown[key] ?? {}
            return (
              <div key={key} className="bg-white rounded-3xl shadow-card p-6">
                <p className="text-sm text-gray-500 uppercase">{key}</p>
                <p className="text-3xl font-semibold text-charcoal mt-3">{formatCurrency(item.revenue ?? 0)}</p>
                <p className="text-sm text-gray-400 mt-1">{formatNumber(item.transactions ?? 0)} giao dịch</p>
              </div>
            )
          })}
        </div> {/* Kết thúc phân rã thời gian */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Phân theo gói */}
          {packageCards.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-3xl shadow-card p-6 space-y-3">
              <p className="text-sm text-gray-500">{pkg.title}</p>
              <p className="text-3xl font-semibold text-charcoal">{pkg.revenue}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{pkg.transactions} giao dịch</span>
                <span>{pkg.revenuePercent}% doanh thu</span>
                <span>{pkg.transactionPercent}% giao dịch</span>
              </div>
            </div>
          ))}
        </div> {/* Kết thúc gói */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6"> {/* Biểu đồ doanh thu */}
          <ChartCard title="Doanh thu & giao dịch theo chu kỳ">
            <ResponsiveContainer width="100%" height="100%"> {/* Container */}
              <LineChart data={revenueData?.timeSeries ?? []} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" /> {/* Lưới */}
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#6B7280' }} /> {/* Trục X */}
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(val) => `${Math.round((val ?? 0) / 1000)}k`}
                /> {/* Trục Y trái doanh thu (nghìn ₫) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                /> {/* Trục Y phải giao dịch */}
                <Tooltip
                  formatter={(value, name, props) => {
                    if (props.dataKey === 'revenue') {
                      return [formatCurrency(value), 'Doanh thu']
                    }
                    if (props.dataKey === 'transactions') {
                      return [formatNumber(value), 'Giao dịch']
                    }
                    return [formatNumber(value), name]
                  }}
                  labelFormatter={(label) => `Chu kỳ: ${label}`}
                /> {/* Tooltip chi tiết */}
                <Legend
                  verticalAlign="top"
                  height={24}
                  formatter={(value) => (value === 'revenue' ? 'Doanh thu (₫)' : 'Giao dịch')}
                /> {/* Chú thích */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke="#F5C76A"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                /> {/* Đường doanh thu */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="transactions"
                  name="transactions"
                  stroke="#50C878"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                /> {/* Đường giao dịch */}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard> {/* Hết biểu đồ 1 */}

          <ChartCard title="Cơ cấu người dùng Free/Premium">
            <div className="h-full flex flex-col lg:flex-row items-center gap-8"> {/* Bao biểu đồ + thống kê */}
              <div className="relative w-full lg:w-1/2 h-64"> {/* Khối biểu đồ */}
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={4}
                      labelLine={false}
                    >
                      {pieData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1">
                  <p className="text-2xl font-semibold text-charcoal">{formatNumber(totalUsers)}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Tổng user</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Thống kê chi tiết */}
                {pieData.map((slice) => (
                  <div key={slice.name} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-charcoal">{slice.name}</p>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
                    </div>
                    <p className="text-2xl font-semibold text-charcoal mt-2">{formatNumber(slice.value)}</p>
                    <p className="text-sm text-gray-500">người dùng</p>
                    <p className="text-sm text-gray-400 mt-1">{slice.percentage ?? 0}% tổng số</p>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard> {/* Hết biểu đồ người dùng */}
        </div> {/* Hết grid biểu đồ */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6"> {/* Biểu đồ bar user + bảng */}
          <ChartCard title="Số lượng người dùng theo gói">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#50C878" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="bg-white rounded-3xl shadow-card p-6 space-y-4">
            <div>
              <p className="text-xl font-semibold text-charcoal">Time series breakdown</p>
              <p className="text-sm text-gray-500">Chi tiết revenue & giao dịch từng chu kỳ</p>
            </div>
            {isLoading ? (
              <p className="text-center text-gray-400">Đang tải dữ liệu...</p>
            ) : (
              <DataTable columns={timeSeriesColumns} rows={timeSeriesRows} />
            )}
          </div>
        </div> {/* Kết thúc grid cuối */}
      </div> {/* Kết thúc nội dung */}
    </PageWrapper> // Kết thúc trang
  ) // Kết thúc JSX
} // Kết thúc component

export default AdminFrequency // Xuất component

