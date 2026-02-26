import axios from 'axios'

// OPhim API Configuration
const OPHIM_BASE_URL = 'https://ophim1.com'

// Create axios instance for OPhim API
const api = axios.create({
  baseURL: OPHIM_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // OPhim API returns data in response.data format
    return response.data
  },
  (error) => {
    // Handle errors
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tải dữ liệu'
    
    console.error('API Error:', errorMessage)
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    })
  }
)

// Create separate axios instance for authentication API (future use)
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for auth API - Attach JWT token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for auth API
authApi.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
            { refreshToken }
          )
          
          const newToken = response.data.token
          localStorage.setItem('token', newToken)
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return authApi(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra'
    
    console.error('Auth API Error:', errorMessage)
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    })
  }
)

export default api
export { authApi, OPHIM_BASE_URL }
