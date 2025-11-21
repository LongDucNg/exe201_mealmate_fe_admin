import { FiTrash2, FiFilter } from 'react-icons/fi' // Import icon hành động
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' // Hook gọi API + mutation
import { useMemo, useState } from 'react'
import PageWrapper from '../components/Layout/PageWrapper.jsx' // Import bố cục
import DataTable from '../components/DataTable.jsx' // Import bảng
import apiClient from '../lib/apiClient.js' // HTTP client

const PAGE_SIZE = 20 // Số lượng user mỗi trang

const roleColors = { // Map màu role
  administrator: 'bg-lilac text-charcoal', // Màu admin
  manager: 'bg-indigo-100 text-indigo-600', // Màu manager
  customer: 'bg-emerald-100 text-emerald-700', // Người dùng
  guest: 'bg-gray-100 text-gray-500', // Khách
} // Kết thúc map

const fetchUsers = async () => {
  const response = await apiClient.get('/users/getallprofile', {
    params: { limit: 1000 }, // Lấy tất cả users (limit lớn để lấy hết)
  }) // Gọi API danh sách user (lấy tất cả)
  return response.data // Trả về dữ liệu
}

const membershipOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'premium', label: 'Premium' },
  { value: 'free', label: 'Free' },
]

const AdminUsers = () => { // Component trang user
  const queryClient = useQueryClient() // Query client để quản lý cache
  const [page, setPage] = useState(1) // State trang hiện tại (client-side pagination)
  const [membershipFilter, setMembershipFilter] = useState('all') // State filter membership
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'], // QueryKey không cần page vì lấy tất cả data
    queryFn: fetchUsers, // Gọi API lấy tất cả users
  }) // Gọi API với React Query

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/users/${id}`),
    onSuccess: (_response, id) => {
      // Invalidate query để refetch data mới nhất
      queryClient.invalidateQueries({ queryKey: ['users'] })
      alert('Đã xoá tài khoản người dùng')
    },
    onError: (mutationError) => {
      alert(`Không thể xoá người dùng: ${mutationError.response?.data?.message ?? mutationError.message}`)
    },
  })

  const rows = useMemo(() => {
    if (!Array.isArray(data?.data?.items)) return []
    return data.data.items.map((row) => {
      const membershipType = row.premiumMembershipType
      const membership = membershipType ? 'premium' : 'free'
      const membershipLabel = membership === 'premium' ? 'Premium' : 'Free'
      return { ...row, actions: 'actions', membership, membershipLabel }
    })
  }, [data])

  const filteredRows = useMemo(() => {
    if (membershipFilter === 'all') return rows
    return rows.filter((row) => row.membership === membershipFilter)
  }, [rows, membershipFilter]) // Filter rows theo membership

  // Client-side pagination: tính toán dựa trên filteredRows
  const totalItems = filteredRows.length // Tổng số items sau khi filter
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE)) // Tổng số trang
  const currentPage = page // Trang hiện tại
  const hasPrevPage = currentPage > 1 // Có trang trước không
  const hasNextPage = currentPage < totalPages // Có trang sau không

  // Slice filteredRows để hiển thị chỉ items của trang hiện tại
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE // Index bắt đầu
    const endIndex = startIndex + PAGE_SIZE // Index kết thúc
    return filteredRows.slice(startIndex, endIndex) // Lấy items của trang hiện tại
  }, [filteredRows, currentPage]) // Recalculate khi filteredRows hoặc currentPage thay đổi

  const columns = [ // Cột bảng
    {
      key: 'fullName',
      label: 'Họ tên',
      render: (value, row) => (
        <div className="space-y-1">
          <p className="font-semibold text-lg">{value ?? row.username}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    }, // Tên
    {
      key: 'role',
      label: 'User Role',
      render: (value) => (
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${roleColors[value] ?? 'bg-gray-100 text-gray-500'}`}>
          {value}
        </span>
      ),
    }, // Vai trò
    {
      key: 'membershipLabel',
      label: 'Membership',
      render: (_, row) => (
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
            row.membership === 'premium' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.membership === 'premium' ? 'Premium' : 'Free'}
        </span>
      ),
    }, // Membership
    {
      key: 'updatedAt',
      label: 'Cập nhật',
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
    }, // Lần đăng nhập
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          className={`p-2 rounded-full text-danger hover:bg-danger/10 transition ${
            deleteMutation.isPending ? 'opacity-50 pointer-events-none' : ''
          }`}
          title="Xoá người dùng"
          onClick={() => {
            if (deleteMutation.isPending) return
            if (window.confirm(`Bạn chắc chắn muốn xoá tài khoản "${row.fullName ?? row.username}"?`)) {
              deleteMutation.mutate(row._id)
            }
          }}
        >
          <FiTrash2 />
        </button>
      ),
    }, // Hành động
  ] // Kết thúc cột

  return ( // JSX
    <PageWrapper title="Administrator" subtitle="MealMate Dashboard"> {/* Bố cục */}
      <div className="space-y-6"> {/* Nội dung */}
        <div className="bg-white rounded-[32px] shadow-card p-8 flex flex-wrap gap-6 justify-between items-center border border-gray-100">
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-charcoal">Quản lý tài khoản</p>
            <p className="text-base text-gray-500 flex items-center gap-2">
              <span className="text-3xl font-bold text-brand">{isLoading ? '...' : totalItems}</span>
              người dùng
            </p>
            <p className="text-sm text-gray-400">Lọc và giám sát trạng thái membership</p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-gray-200 bg-gray-50">
            <FiFilter className="text-gray-500" />
            <select
              value={membershipFilter}
              onChange={(event) => {
                setMembershipFilter(event.target.value) // Cập nhật filter
                setPage(1) // Reset về trang 1 khi filter thay đổi
              }}
              className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none"
            >
              {membershipOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div> {/* Khối tiêu đề bảng */}
        <div className="bg-white rounded-[32px] shadow-card border border-gray-100 p-2">
          {isLoading && <p className="text-center text-gray-500 py-8">Đang tải dữ liệu...</p>}
          {isError && (
            <p className="text-center text-danger py-8">
              Không thể tải dữ liệu: {error.message ?? 'Lỗi không xác định'}
            </p>
          )}
          {!isLoading && !isError && <DataTable columns={columns} rows={paginatedRows} />} {/* Bảng dữ liệu với pagination */}
          {!isLoading && !isError && (
            <div className="flex items-center justify-between pt-2 px-2 pb-4 text-sm text-gray-500">
              <button
                className="px-4 py-2 rounded-full border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
                disabled={currentPage <= 1 || hasPrevPage === false}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Trang trước
              </button>
              <span className="text-sm">
                Trang {currentPage} / {totalPages}
                {totalItems ? ` · Tổng: ${totalItems} người dùng` : ''}
              </span>
              <button
                className="px-4 py-2 rounded-full border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
                disabled={hasNextPage === false}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </div> {/* Kết thúc nội dung */}
    </PageWrapper> // Kết thúc trang
  ) // Kết thúc JSX
} // Kết thúc component

export default AdminUsers // Xuất component

