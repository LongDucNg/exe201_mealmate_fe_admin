import apiClient from './apiClient.js' // Import axios instance

export const mealApi = {
  // Lấy tất cả món - thử với limit lớn để lấy tất cả
  getAll: (page = 1, limit = 1000) =>
    apiClient.get('/meal/getallmeal', { params: { page, limit } }), // Thêm pagination params để lấy tất cả
  search: (name, page = 1, limit = 10) =>
    apiClient.get('/meal/searchmeal', { params: { name, page, limit } }), // Tìm kiếm món ăn theo tên
  create: (payload) => apiClient.post('/meal/createmeal', payload), // Tạo món ăn (admin)
  update: (id, payload) => apiClient.put(`/meal/updatemeal/${id}`, payload), // Cập nhật món ăn (admin)
  remove: (id) => apiClient.delete(`/meal/deletemeal/${id}`), // Xóa món ăn (admin)
  getById: (id) => apiClient.get(`/meal/getmealbyid/${id}`), // Lấy chi tiết món ăn
}

