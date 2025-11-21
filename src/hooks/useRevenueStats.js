import { useQuery } from '@tanstack/react-query' // Import hook useQuery để quản lý server-state
import apiClient from '../lib/apiClient.js' // Import API client dùng chung

const fetchRevenueStats = async ({ queryKey }) => { // Hàm fetch dữ liệu doanh thu
  const [, period] = queryKey // Lấy period từ queryKey
  const response = await apiClient.get('/payment/revenue', { params: { period } }) // Gọi API với query period
  return response.data?.data ?? null // Trả về phần data, fallback null
} // Kết thúc hàm fetch

const useRevenueStats = (period = 'week') => // Hook nhận period
  useQuery({ // Trả về useQuery
    queryKey: ['revenue-stats', period], // Khóa cache theo period
    queryFn: fetchRevenueStats, // Hàm fetch
    enabled: Boolean(period), // Chỉ chạy khi có period
    staleTime: 60 * 1000, // Cache 60 giây
    refetchOnWindowFocus: false, // Không refetch khi focus
  }) // Kết thúc cấu hình useQuery

export default useRevenueStats // Xuất hook


