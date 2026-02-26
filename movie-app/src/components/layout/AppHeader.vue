<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Bell, User, Menu, X, LogOut, UserCircle } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/authStore'
import { useUIStore } from '../../stores/uiStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()

const isScrolled = ref(false)
const showMobileMenu = ref(false)
const showUserDropdown = ref(false)

// Check if browse page is movies or series
const isMoviesPage = computed(() => {
  return route.path === '/browse' && !route.query.type
})

const isSeriesPage = computed(() => {
  return route.path === '/browse' && route.query.type === 'series'
})

// Handle scroll event to add background to header
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Handle click outside to close dropdown
const handleClickOutside = (event) => {
  const userMenu = event.target.closest('.user-menu')
  if (!userMenu && showUserDropdown.value) {
    showUserDropdown.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
  showMobileMenu.value = false
  showUserDropdown.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  showUserDropdown.value = false
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const navigateTo = (path) => {
  router.push(path)
  showMobileMenu.value = false
  showUserDropdown.value = false
}
</script>

<template>
  <header class="app-header" :class="{ 'scrolled': isScrolled }">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <h1>NET<span>FLEX</span></h1>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="nav-menu desktop-only">
          <router-link to="/" class="nav-link">Trang Chủ</router-link>
          <a @click.prevent="navigateTo('/browse')" :class="['nav-link', { 'active': isMoviesPage }]" href="/browse">Phim</a>
          <a @click.prevent="navigateTo('/browse?type=series')" :class="['nav-link', { 'active': isSeriesPage }]" href="/browse?type=series">Series</a>
          <router-link to="/watchlist" v-if="authStore.isLoggedIn" class="nav-link">Yêu Thích</router-link>
        </nav>

        <!-- Actions -->
        <div class="header-actions">
          <!-- Search -->
          <router-link to="/search" class="icon-btn" title="Tìm kiếm">
            <Search :size="20" />
          </router-link>

          <!-- Notifications (if logged in) -->
          <button v-if="authStore.isLoggedIn" class="icon-btn" title="Thông báo">
            <Bell :size="20" />
          </button>

          <!-- User Menu -->
          <div v-if="authStore.isLoggedIn" class="user-menu">
            <button class="icon-btn user-avatar" @click="toggleUserDropdown">
              <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" />
              <User v-else :size="20" />
            </button>
            
            <!-- User Dropdown -->
            <Transition name="fade">
              <div v-if="showUserDropdown" class="user-dropdown">
                <div class="dropdown-header">
                  <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="Avatar" class="dropdown-avatar" />
                  <div class="dropdown-user-info">
                    <p class="user-name">{{ authStore.user?.fullName || authStore.user?.username }}</p>
                    <p class="user-email">{{ authStore.user?.email }}</p>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <ul class="dropdown-menu">
                  <li>
                    <button @click="navigateTo('/profile')" class="dropdown-item">
                      <UserCircle :size="18" />
                      <span>Hồ Sơ</span>
                    </button>
                  </li>
                  <li>
                    <button @click="handleLogout" class="dropdown-item logout">
                      <LogOut :size="18" />
                      <span>Đăng Xuất</span>
                    </button>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>

          <!-- Login Button (if not logged in) -->
          <router-link v-else to="/login" class="btn btn-primary">
            Đăng Nhập
          </router-link>

          <!-- Mobile Menu Toggle -->
          <button class="icon-btn mobile-only" @click="toggleMobileMenu">
            <Menu v-if="!showMobileMenu" :size="24" />
            <X v-else :size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="showMobileMenu" class="mobile-menu">
        <nav class="mobile-nav">
          <a @click="navigateTo('/')" class="mobile-nav-link">Trang Chủ</a>
          <a @click="navigateTo('/browse')" class="mobile-nav-link">Phim</a>
          <a @click="navigateTo('/browse?type=series')" class="mobile-nav-link">Series</a>
          <a v-if="authStore.isLoggedIn" @click="navigateTo('/watchlist')" class="mobile-nav-link">Yêu Thích</a>
          <a v-if="authStore.isLoggedIn" @click="navigateTo('/profile')" class="mobile-nav-link">Hồ Sơ</a>
          <a v-if="authStore.isLoggedIn" @click="handleLogout" class="mobile-nav-link">Đăng Xuất</a>
          <a v-else @click="navigateTo('/login')" class="mobile-nav-link">Đăng Nhập</a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);
  transition: var(--transition-base);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
}

.app-header.scrolled {
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-md);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) 0;
  gap: var(--space-lg);
}

/* Logo */
.logo h1 {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.logo span {
  color: var(--accent-primary);
}

.logo:hover {
  opacity: 0.8;
}

/* Desktop Navigation */
.nav-menu {
  display: flex;
  gap: var(--space-lg);
  flex: 1;
  margin-left: var(--space-2xl);
}

.nav-link {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: var(--transition-base);
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active,
.nav-link.active {
  color: var(--text-primary);
}

.nav-link.router-link-active::after,
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--accent-primary);
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  transition: var(--transition-base);
}

.icon-btn:hover {
  background-color: var(--bg-elevated);
  transform: scale(1.05);
}

.user-avatar {
  border-radius: var(--radius-full);
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* User Menu & Dropdown */
.user-menu {
  position: relative;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background-color: var(--bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 100;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background-color: var(--bg-card);
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.dropdown-user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border-color);
}

.dropdown-menu {
  list-style: none;
  margin: 0;
  padding: var(--space-sm);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  padding: var(--space-md);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: var(--transition-base);
  cursor: pointer;
  text-align: left;
}

.dropdown-item:hover {
  background-color: var(--bg-card);
}

.dropdown-item.logout {
  color: var(--danger);
}

.dropdown-item.logout:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

/* Fade animation for dropdown */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Mobile Menu */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--bg-elevated);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: var(--space-md);
  gap: var(--space-xs);
}

.mobile-nav-link {
  padding: var(--space-md);
  color: var(--text-primary);
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: var(--transition-base);
  cursor: pointer;
}

.mobile-nav-link:hover {
  background-color: var(--bg-card);
  color: var(--accent-primary);
}

/* Slide down animation for mobile menu */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .header-content {
    padding: var(--space-sm) 0;
  }

  .logo h1 {
    font-size: var(--font-size-lg);
  }
}
</style>
