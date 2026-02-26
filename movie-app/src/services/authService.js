import { authApi } from './api'

/**
 * Mock users for development/testing bypass
 */
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'chamchi123',
    email: 'admin@movieapp.com',
    fullName: 'Administrator',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    username: 'thanhnt',
    password: 'chamchi123',
    email: 'thanhnt@movieapp.com',
    fullName: 'Nguyễn Thanh',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 3,
    username: 'dungnt',
    password: 'chamchi123',
    email: 'dungnt@movieapp.com',
    fullName: 'Nguyễn Dũng',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
]

/**
 * Authentication Service
 * Uses authApi instance which includes JWT token handling
 */

const authService = {
  /**
   * Login with credentials
   * @param {Object} credentials - { email, password } or { username, password }
   * @returns {Promise}
   */
  async login(credentials) {
    // Check mock users first for bypass
    const { username, email, password } = credentials
    const mockUser = MOCK_USERS.find(
      user => (user.username === username || user.email === email) && user.password === password
    )
    
    if (mockUser) {
      // Mock successful login
      const mockToken = 'mock-jwt-token-' + mockUser.id
      const mockResponse = {
        success: true,
        token: mockToken,
        refreshToken: 'mock-refresh-token-' + mockUser.id,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          fullName: mockUser.fullName,
          role: mockUser.role,
          avatar: mockUser.avatar
        }
      }
      
      // Store tokens and user
      localStorage.setItem('token', mockResponse.token)
      localStorage.setItem('refreshToken', mockResponse.refreshToken)
      localStorage.setItem('user', JSON.stringify(mockResponse.user))
      
      return mockResponse
    }
    
    // If not mock user, throw error (no backend API available)
    throw new Error('Tài khoản hoặc mật khẩu không đúng. Vui lòng sử dụng tài khoản mock: admin, thanhnt, hoặc dungnt')
  },

  /**
   * Register new user
   * @param {Object} data - User registration data
   * @returns {Promise}
   */
  async register(data) {
    // Mock registration - not implemented in mock mode
    throw new Error('Đăng ký chưa được hỗ trợ. Vui lòng sử dụng tài khoản mock có sẵn.')
  },

  /**
   * Logout current user
   * @returns {Promise}
   */
  async logout() {
    // Mock logout - just clear local storage (no backend call needed)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    return { success: true, message: 'Đăng xuất thành công' }
  },

  /**
   * Get current user profile
   * @returns {Promise}
   */
  async getProfile() {
    // Mock profile - get user from localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      return { success: true, user }
    }
    throw new Error('User not found')
  },

  /**
   * Update user profile
   * @param {Object} data - Profile update data
   * @returns {Promise}
   */
  async updateProfile(data) {
    const response = await authApi.put('/auth/profile', data)
    return response
  },

  /**
   * Refresh authentication token
   * @returns {Promise}
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await authApi.post('/auth/refresh', { refreshToken })
    
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    
    return response
  },

  /**
   * Request password reset email
   * @param {string} email - User email
   * @returns {Promise}
   */
  async forgotPassword(email) {
    const response = await authApi.post('/auth/forgot-password', { email })
    return response
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token from email
   * @param {string} password - New password
   * @returns {Promise}
   */
  async resetPassword(token, password) {
    const response = await authApi.post('/auth/reset-password', { token, password })
    return response
  },

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise}
   */
  async verifyEmail(token) {
    const response = await authApi.post('/auth/verify-email', { token })
    return response
  },

  /**
   * Change password (requires current password)
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise}
   */
  async changePassword(currentPassword, newPassword) {
    const response = await authApi.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token')
  },

  /**
   * Get stored user data
   * @returns {Object|null}
   */
  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  /**
   * Store user data
   * @param {Object} user - User data
   */
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export default authService
