import { useQuery } from '@tanstack/react-query' // Import useQuery cho state người dùng
import apiClient from '../lib/apiClient.js' // Import API client

const fetchUserStats = async ({ queryKey }) => { // Hàm fetch số liệu user
  const [, period] = queryKey // Tách period khỏi queryKey
  const response = await apiClient.get('/users/stats', { params: { period } }) // Call API với period
  return response.data?.data ?? null // Trả về data hoặc null
} // Kết thúc fetch

const useUserStats = (period = 'week') => // Hook thống kê user
  useQuery({ // Trả về useQuery
    queryKey: ['user-stats', period], // Khóa theo period
    queryFn: fetchUserStats, // Hàm fetch
    enabled: Boolean(period), // Chỉ chạy khi có period
    staleTime: 60 * 1000, // Cache 60 giây
    refetchOnWindowFocus: false, // Không refetch khi focus
  }) // Kết thúc cấu hình

export default useUserStats // Xuất hook


