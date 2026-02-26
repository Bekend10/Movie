import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views
const HomePage = () => import('../views/HomePage.vue')
const MovieDetailPage = () => import('../views/MovieDetailPage.vue')
const BrowsePage = () => import('../views/BrowsePage.vue')
const SearchPage = () => import('../views/SearchPage.vue')
const PlayerPage = () => import('../views/PlayerPage.vue')
const LoginPage = () => import('../views/LoginPage.vue')
const RegisterPage = () => import('../views/RegisterPage.vue')
const ProfilePage = () => import('../views/ProfilePage.vue')
const WatchlistPage = () => import('../views/WatchlistPage.vue')
const NotFoundPage = () => import('../views/NotFoundPage.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Trang Chủ - NetFlex' }
  },
  {
    path: '/movie/:slug',
    name: 'MovieDetail',
    component: MovieDetailPage,
    meta: { title: 'Chi Tiết Phim - NetFlex' }
  },
  {
    path: '/browse',
    name: 'Browse',
    component: BrowsePage,
    meta: { title: 'Duyệt Phim - NetFlex' }
  },
  {
    path: '/browse/:genre',
    name: 'BrowseGenre',
    component: BrowsePage,
    meta: { title: 'Duyệt Phim - NetFlex' }
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage,
    meta: { title: 'Tìm Kiếm - NetFlex' }
  },
  {
    path: '/watch/:slug/:episode?',
    name: 'Watch',
    component: PlayerPage,
    meta: { requiresAuth: true, title: 'Xem Phim - NetFlex' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { guest: true, title: 'Đăng Nhập - NetFlex' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { guest: true, title: 'Đăng Ký - NetFlex' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true, title: 'Hồ Sơ - NetFlex' }
  },
  {
    path: '/watchlist',
    name: 'Watchlist',
    component: WatchlistPage,
    meta: { requiresAuth: true, title: 'Danh Sách Yêu Thích - NetFlex' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: { title: 'Không Tìm Thấy - NetFlex' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set document title
  document.title = to.meta.title || 'NetFlex - Xem Phim Online'

  // Check auth
  const isLoggedIn = localStorage.getItem('token')

  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  }
  // If route is for guests only and user is logged in
  else if (to.meta.guest && isLoggedIn) {
    next({ name: 'Home' })
  }
  // Otherwise, proceed
  else {
    next()
  }
})

export default router
