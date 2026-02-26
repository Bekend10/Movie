import { defineStore } from 'pinia'
import { ref } from 'vue'

const WATCHLIST_STORAGE_KEY = 'netflex_watchlist'

export const useWatchlistStore = defineStore('watchlist', () => {
  // State
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Load from localStorage on initialization
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY)
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (err) {
      console.error('Error loading watchlist from storage:', err)
      items.value = []
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    try {
      // Convert to plain objects to avoid Proxy issues
      const plainItems = items.value.map(item => {
        return JSON.parse(JSON.stringify(item))
      })
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(plainItems))
    } catch (err) {
      console.error('Error saving watchlist to storage:', err)
    }
  }

  // Actions
  function fetchWatchlist() {
    loading.value = true
    error.value = null
    try {
      loadFromStorage()
      return { success: true, data: items.value }
    } catch (err) {
      error.value = err.message || 'Không thể tải danh sách yêu thích'
      throw err
    } finally {
      loading.value = false
    }
  }

  function addToWatchlist(movie) {
    loading.value = true
    error.value = null
    try {
      // Check if movie already exists
      const exists = items.value.find(
        item => item._id === movie._id || item.slug === movie.slug
      )
      
      if (!exists) {
        // Add movie with timestamp
        const watchlistItem = {
          ...movie,
          addedAt: new Date().toISOString()
        }
        items.value.unshift(watchlistItem)
        saveToStorage()
      }
      
      return { success: true, message: 'Đã thêm vào yêu thích' }
    } catch (err) {
      error.value = err.message || 'Không thể thêm vào danh sách yêu thích'
      throw err
    } finally {
      loading.value = false
    }
  }

  function removeFromWatchlist(movieId) {
    loading.value = true
    error.value = null
    try {
      // Remove by _id or slug
      items.value = items.value.filter(
        item => item._id !== movieId && item.slug !== movieId
      )
      saveToStorage()
      return { success: true, message: 'Đã xóa khỏi yêu thích' }
    } catch (err) {
      error.value = err.message || 'Không thể xóa khỏi danh sách yêu thích'
      throw err
    } finally {
      loading.value = false
    }
  }

  function isInWatchlist(movieId) {
    return items.value.some(
      item => item._id === movieId || item.slug === movieId
    )
  }

  function clearWatchlist() {
    items.value = []
    saveToStorage()
  }

  // Initialize on store creation
  loadFromStorage()

  return {
    // State
    items,
    loading,
    error,
    // Actions
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    clearWatchlist
  }
})
