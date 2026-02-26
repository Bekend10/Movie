import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const isSidebarOpen = ref(false)
  const isSearchOpen = ref(false)
  const globalLoading = ref(false)
  const toast = ref({
    show: false,
    message: '',
    type: 'info' // 'info', 'success', 'warning', 'error'
  })

  // Actions
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function openSidebar() {
    isSidebarOpen.value = true
  }

  function closeSidebar() {
    isSidebarOpen.value = false
  }

  function toggleSearch() {
    isSearchOpen.value = !isSearchOpen.value
  }

  function openSearch() {
    isSearchOpen.value = true
  }

  function closeSearch() {
    isSearchOpen.value = false
  }

  function showToast(message, type = 'info', duration = 3000) {
    toast.value = {
      show: true,
      message,
      type
    }

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast()
      }, duration)
    }
  }

  function hideToast() {
    toast.value.show = false
  }

  function setGlobalLoading(value) {
    globalLoading.value = value
  }

  return {
    // State
    isSidebarOpen,
    isSearchOpen,
    globalLoading,
    toast,
    // Actions
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleSearch,
    openSearch,
    closeSearch,
    showToast,
    hideToast,
    setGlobalLoading
  }
})
