<script setup>
import { ref, onMounted, computed } from 'vue'
import { Heart, Trash2, Play, Info } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ToastNotification from '../components/shared/ToastNotification.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import { useWatchlistStore } from '../stores/watchlistStore'
import { useUIStore } from '../stores/uiStore'
import { getPosterUrl } from '../composables/useImageUtils'

const router = useRouter()
const watchlistStore = useWatchlistStore()
const uiStore = useUIStore()

const loading = ref(false)

onMounted(() => {
  watchlistStore.fetchWatchlist()
})

const getPoster = (movie) => {
  // Prioritize full URLs saved from detail/card pages
  if (movie.full_poster_url) {
    return movie.full_poster_url
  }
  
  if (movie.full_thumb_url) {
    return movie.full_thumb_url
  }
  
  // Fallback to getPosterUrl for old items
  return getPosterUrl(movie)
}

const getImageLoadError = (e) => {
  // Use a working placeholder SVG
  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="300" height="450" fill="%23333"/><text x="150" y="225" text-anchor="middle" fill="%23999" font-size="20">No Image</text></svg>'
}

const removeFromWatchlist = (movie) => {
  watchlistStore.removeFromWatchlist(movie._id || movie.slug)
  uiStore.showToast('Đã xóa khỏi yêu thích', 'success')
}

const goToMovie = (slug) => {
  router.push(`/movie/${slug}`)
}

const goToPlayer = (slug) => {
  router.push(`/player/${slug}`)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}
</script>

<template>
  <div class="watchlist-page">
    <AppHeader />
    <ToastNotification />
    
    <main class="watchlist-content">
      <div class="container">
        <!-- Page Header -->
        <div class="page-header">
          <div class="header-text">
            <h1 class="page-title">
              <Heart :size="32" />
              Danh Sách Yêu Thích
            </h1>
            <p class="page-subtitle">
              {{ watchlistStore.items.length }} phim trong danh sách của bạn
            </p>
          </div>
          <button 
            v-if="watchlistStore.items.length > 0"
            @click="watchlistStore.clearWatchlist()"
            class="btn-clear"
          >
            <Trash2 :size="20" />
            Xóa tất cả
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-container">
          <LoadingSpinner />
          <p>Đang tải danh sách...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="watchlistStore.items.length === 0" class="empty-state">
          <div class="empty-icon">
            <Heart :size="80" />
          </div>
          <h3>Danh sách yêu thích trống</h3>
          <p>Hãy thêm những bộ phim yêu thích của bạn vào đây</p>
          <button @click="router.push('/browse')" class="btn-browse">
            Khám phá phim
          </button>
        </div>

        <!-- Watchlist Grid -->
        <div v-else class="watchlist-grid">
          <div
            v-for="movie in watchlistStore.items"
            :key="movie._id || movie.slug"
            class="watchlist-item"
          >
            <div class="movie-poster-container">
              <img
                :src="getPoster(movie)"
                :alt="movie.name"
                class="movie-poster"
                @error="getImageLoadError"
              />
              <div class="movie-overlay">
                <button @click="goToPlayer(movie.slug)" class="btn-play">
                  <Play :size="24" />
                </button>
                <button @click="goToMovie(movie.slug)" class="btn-info">
                  <Info :size="24" />
                </button>
              </div>
              <button 
                @click="removeFromWatchlist(movie)"
                class="btn-remove"
                title="Xóa khỏi yêu thích"
              >
                <Heart :size="20" fill="currentColor" />
              </button>
            </div>
            
            <div class="movie-info">
              <h3 class="movie-title">{{ movie.name }}</h3>
              <p class="movie-original-name">{{ movie.origin_name }}</p>
              
              <div class="movie-meta">
                <span v-if="movie.year" class="meta-item">{{ movie.year }}</span>
                <span v-if="movie.time" class="meta-item">{{ movie.time }}</span>
                <span v-if="movie.quality" class="meta-badge">{{ movie.quality }}</span>
                <span v-if="movie.lang" class="meta-badge">{{ movie.lang }}</span>
              </div>

              <div v-if="movie.addedAt" class="added-date">
                Đã thêm: {{ formatDate(movie.addedAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.watchlist-content {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: var(--space-3xl);
}

/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2xl);
  gap: var(--space-xl);
  flex-wrap: wrap;
}

.header-text {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-title svg {
  color: var(--accent-primary);
  -webkit-text-fill-color: var(--accent-primary);
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
}

.btn-clear {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background: rgba(255, 0, 0, 0.1);
  border: 2px solid rgba(255, 0, 0, 0.3);
  border-radius: var(--radius-lg);
  color: #ff5555;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-clear:hover {
  background: rgba(255, 0, 0, 0.2);
  border-color: #ff0000;
  color: #ff0000;
  transform: translateY(-2px);
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl);
  gap: var(--space-lg);
  min-height: 400px;
}

.loading-container p {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-3xl);
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  margin-bottom: var(--space-xl);
  opacity: 0.3;
  color: var(--accent-primary);
}

.empty-state h3 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-2xl);
}

.btn-browse {
  padding: var(--space-md) var(--space-2xl);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none;
  border-radius: var(--radius-lg);
  color: white;
  font-size: var(--font-size-base);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-browse:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4);
}

/* Watchlist Grid */
.watchlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-xl);
}

.watchlist-item {
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.4), rgba(20, 20, 40, 0.6));
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

.watchlist-item:hover {
  transform: translateY(-8px);
  border-color: var(--accent-primary);
  box-shadow: 0 12px 32px rgba(229, 9, 20, 0.3);
}

.movie-poster-container {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.watchlist-item:hover .movie-poster {
  transform: scale(1.1);
}

.movie-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  opacity: 0;
  transition: opacity 0.3s;
}

.watchlist-item:hover .movie-overlay {
  opacity: 1;
}

.btn-play,
.btn-info {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-play {
  background: var(--accent-primary);
  color: white;
}

.btn-play:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(229, 9, 20, 0.5);
}

.btn-info {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-info:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.btn-remove {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(229, 9, 20, 0.9);
  border: none;
  border-radius: var(--radius-full);
  color: white;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s;
  z-index: 10;
}

.watchlist-item:hover .btn-remove {
  opacity: 1;
  transform: scale(1);
}

.btn-remove:hover {
  background: var(--accent-primary);
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(229, 9, 20, 0.6);
}

.movie-info {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.movie-title {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-original-name {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  font-size: var(--font-size-xs);
}

.meta-item {
  color: var(--text-secondary);
}

.meta-badge {
  padding: 2px 8px;
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid rgba(229, 9, 20, 0.4);
  border-radius: var(--radius-sm);
  color: var(--accent-primary);
  font-weight: 600;
}

.added-date {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  opacity: 0.7;
  margin-top: var(--space-xs);
}

/* Responsive */
@media (max-width: 768px) {
  .watchlist-content {
    padding-top: 80px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-clear {
    width: 100%;
    justify-content: center;
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }

  .watchlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-md);
  }
}
</style>
