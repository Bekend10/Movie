import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      user.value = response.user
      token.value = response.token
      localStorage.setItem('token', response.token)
      return response
    } catch (err) {
      error.value = err.message || 'Đăng nhập thất bại'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(data)
      user.value = response.user
      token.value = response.token
      localStorage.setItem('token', response.token)
      return response
    } catch (err) {
      error.value = err.message || 'Đăng ký thất bại'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
    }
  }

  async function fetchProfile() {
    if (!token.value) return
    
    loading.value = true
    error.value = null
    try {
      const response = await authService.getProfile()
      user.value = response.user
      return response
    } catch (err) {
      error.value = err.message || 'Không thể tải thông tin người dùng'
      // If token is invalid, logout
      if (err.status === 401) {
        logout()
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function refreshToken() {
    try {
      const response = await authService.refreshToken()
      token.value = response.token
      localStorage.setItem('token', response.token)
      return response
    } catch (err) {
      logout()
      throw err
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isLoggedIn,
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    refreshToken
  }
})
