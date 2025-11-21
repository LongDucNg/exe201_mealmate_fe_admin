import axios from 'axios' // Import axios để tạo HTTP client

const apiClient = axios.create({
  baseURL: 'https://exe-be-v4pd.onrender.com/api', // Base URL backend
  headers: {
    'Content-Type': 'application/json',
    // Không thêm Cache-Control vì server không cho phép trong CORS policy
    // Server chỉ cho phép: Content-Type, Authorization
  }, // Header mặc định
  withCredentials: true, // Cho phép gửi cookie nếu backend cần
  timeout: 30000, // Timeout 30 giây để tránh request bị treo
}) // Khởi tạo instance

const getStoredToken = () => {
  const rawAuth = window.localStorage.getItem('mealmate_auth')
  if (rawAuth) {
    try {
      const parsed = JSON.parse(rawAuth)
      return parsed.tokens?.accessToken
    } catch {
      return null
    }
  }
  return window.localStorage.getItem('accessToken')
}

// Request interceptor: Thêm token vào header và log request
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Log request để debug
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      hasToken: !!token,
      headers: config.headers,
    })
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor: Xử lý lỗi 401 (Unauthorized) và Network Error
apiClient.interceptors.response.use(
  (response) => {
    // Log response thành công để debug
    console.log('API Response Success:', {
      status: response.status,
      url: response.config?.url,
      data: response.data,
    })
    return response // Trả về response nếu thành công
  },
  (error) => {
    // Log chi tiết lỗi để debug
    console.error('API Response Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A',
      },
      request: error.request,
    })

    // Kiểm tra nếu lỗi Network Error
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network Error Details:', {
        message: 'Có thể do: CORS, server không phản hồi, hoặc network connection issue',
        requestSent: !!error.request,
        responseReceived: !!error.response,
      })
    }

    // Kiểm tra nếu lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Xóa token và auth data khỏi localStorage
      window.localStorage.removeItem('mealmate_auth')
      window.localStorage.removeItem('accessToken')
      // Redirect về trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error) // Trả về lỗi để component xử lý
  },
)

export default apiClient // Xuất client dùng chung

