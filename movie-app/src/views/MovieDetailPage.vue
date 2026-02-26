<script setup>
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ToastNotification from '../components/shared/ToastNotification.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Play, Plus, Heart, Clock, Calendar } from 'lucide-vue-next'
import movieService from '../services/movieService'
import { getImageUrl, getPosterUrl, processTMDBImages, getOPhimImageUrl } from '../composables/useImageUtils'
import { useWatchlistStore } from '../stores/watchlistStore'
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const watchlistStore = useWatchlistStore()
const uiStore = useUIStore()
const authStore = useAuthStore()

const movie = ref(null)
const images = ref([])
const loading = ref(true)
const error = ref(null)
const cdnImageDomain = ref('')
const schemaImage = ref('')
const episodes = ref([])
const selectedServer = ref(0)
const selectedEpisode = ref(null)

const posterUrl = computed(() => {
  if (!movie.value) return '/placeholder.jpg'
  
  // Use schema image if available
  if (schemaImage.value) {
    return schemaImage.value
  }
  
  // Use CDN domain + poster_url with helper function
  if (cdnImageDomain.value && movie.value.poster_url) {
    return getOPhimImageUrl(movie.value.poster_url, cdnImageDomain.value)
  }
  
  return getPosterUrl(movie.value)
})

const thumbUrl = computed(() => {
  if (!movie.value) return '/placeholder.jpg'
  
  // Use schema image if available
  if (schemaImage.value) {
    return schemaImage.value
  }
  
  // Use CDN domain + thumb_url with helper function
  if (cdnImageDomain.value && movie.value.thumb_url) {
    return getOPhimImageUrl(movie.value.thumb_url, cdnImageDomain.value)
  }
  
  return getImageUrl(movie.value.thumb_url)
})

const fetchMovieData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const slug = route.params.slug
    
    // Fetch movie detail
    const detailResponse = await movieService.getMovieDetail(slug)
    
    if (detailResponse.status === 'success' && detailResponse.data?.item) {
      movie.value = detailResponse.data.item
      
      // Get episodes data
      if (movie.value.episodes && Array.isArray(movie.value.episodes)) {
        episodes.value = movie.value.episodes
        // Auto-select first episode of first server
        if (episodes.value.length > 0 && episodes.value[0].server_data?.length > 0) {
          selectedEpisode.value = episodes.value[0].server_data[0]
        }
      }
      
      // Get CDN domain from response
      if (detailResponse.data.APP_DOMAIN_CDN_IMAGE) {
        cdnImageDomain.value = detailResponse.data.APP_DOMAIN_CDN_IMAGE
      }
      
      // Get schema image from SEO data
      if (detailResponse.data.seoOnPage?.seoSchema?.image) {
        schemaImage.value = detailResponse.data.seoOnPage.seoSchema.image
        
        // Add schema image to images array
        if (!images.value.includes(schemaImage.value)) {
          images.value.unshift(schemaImage.value)
        }
      }
    } else {
      throw new Error('Không tìm thấy phim')
    }
    
    // Fetch movie images
    try {
      const imagesResponse = await movieService.getMovieImages(slug)
      
      // Handle both response formats: {success: true} or {status: "success"}
      const isSuccess = imagesResponse.success === true || imagesResponse.status === 'success'
      
      if (isSuccess && imagesResponse.data) {
        // Use helper function to process TMDB images
        images.value = processTMDBImages(imagesResponse.data, {
          type: 'backdrop',
          limit: 12,
          size: 'original'
        })
      }
    } catch (err) {
      // Images are optional, don't fail the page
    }
    
  } catch (err) {
    console.error('Error fetching movie:', err)
    error.value = err.message || 'Có lỗi xảy ra khi tải dữ liệu'
    uiStore.showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const playMovie = (episode = null) => {
  const episodeSlug = episode?.slug || selectedEpisode.value?.slug
  if (episodeSlug) {
    router.push(`/watch/${route.params.slug}/${episodeSlug}`)
  } else {
    router.push(`/watch/${route.params.slug}`)
  }
}

const selectServer = (serverIndex) => {
  selectedServer.value = serverIndex
  // Auto-select first episode of selected server
  if (episodes.value[serverIndex]?.server_data?.length > 0) {
    selectedEpisode.value = episodes.value[serverIndex].server_data[0]
  }
}

const selectEpisode = (episode) => {
  selectedEpisode.value = episode
  playMovie(episode)
}

const isInWatchlist = computed(() => {
  if (!movie.value) return false
  return watchlistStore.isInWatchlist(movie.value._id || movie.value.slug)
})

const hasEpisodes = computed(() => {
  // Check if movie has any episodes to watch
  if (!episodes.value || episodes.value.length === 0) return false
  
  // Check if any server has episodes
  const hasValidEpisodes = episodes.value.some(server => 
    server.server_data && server.server_data.length > 0
  )
  
  return hasValidEpisodes
})

const isTrailerOnly = computed(() => {
  // Check if episode_current indicates trailer only
  if (movie.value?.episode_current?.toLowerCase().includes('trailer')) return true
  return !hasEpisodes.value
})

const toggleWatchlist = () => {
  // Check if user is logged in
  if (!authStore.isLoggedIn) {
    uiStore.showToast('Vui lòng đăng nhập để thêm vào yêu thích', 'warning')
    router.push('/login')
    return
  }

  try {
    if (isInWatchlist.value) {
      watchlistStore.removeFromWatchlist(movie.value._id || movie.value.slug)
      uiStore.showToast('Đã xóa khỏi danh sách yêu thích', 'info')
    } else {
      // Prepare movie object with full image URLs
      const movieToSave = {
        ...movie.value,
        full_poster_url: posterUrl.value,
        full_thumb_url: thumbUrl.value
      }
      
      watchlistStore.addToWatchlist(movieToSave)
      uiStore.showToast('Đã thêm vào danh sách yêu thích', 'success')
    }
  } catch (err) {
    uiStore.showToast('Có lỗi xảy ra', 'error')
  }
}

onMounted(() => {
  fetchMovieData()
})
</script>

<template>
  <div class="movie-detail-page">
    <AppHeader />
    <ToastNotification />
    
    <main class="detail-content">
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button @click="$router.push('/')" class="btn-back">Quay về trang chủ</button>
      </div>
      
      <div v-else-if="movie" class="movie-detail-container">
        <!-- Backdrop -->
        <div class="backdrop-container">
          <div class="backdrop-overlay"></div>
          <img :src="thumbUrl" :alt="movie.name" class="backdrop-image" />
        </div>
        
        <!-- Content -->
        <div class="container">
          <div class="detail-wrapper">
            <!-- Poster -->
            <div class="poster-section">
              <img :src="posterUrl" :alt="movie.name" class="movie-poster" />
            </div>
            
            <!-- Info -->
            <div class="info-section">
              <h1 class="movie-title">{{ movie.name }}</h1>
              <h2 v-if="movie.origin_name" class="movie-origin-name">{{ movie.origin_name }}</h2>
              
              <div class="movie-meta">
                <span v-if="movie.tmdb?.vote_average" class="rating">
                  ★ {{ movie.tmdb.vote_average }}/10
                </span>
                <span v-if="movie.year" class="year">
                  <Calendar :size="16" /> {{ movie.year }}
                </span>
                <span v-if="movie.time" class="duration">
                  <Clock :size="16" /> {{ movie.time }}
                </span>
                <span v-if="movie.episode_current" class="episode">
                  {{ movie.episode_current }}
                </span>
              </div>
              
              <!-- Genres -->
              <div v-if="movie.category?.length" class="genres">
                <span 
                  v-for="genre in movie.category" 
                  :key="genre.slug"
                  class="genre-tag"
                >
                  {{ genre.name }}
                </span>
              </div>
              
              <!-- Countries -->
              <div v-if="movie.country?.length" class="countries">
                <strong>Quốc gia:</strong>
                <span v-for="(country, index) in movie.country" :key="country.slug">
                  {{ country.name }}<template v-if="index < movie.country.length - 1">, </template>
                </span>
              </div>
              
              <!-- Actions -->
              <div class="action-buttons">
                <button @click="playMovie" class="btn btn-play" :disabled="isTrailerOnly" :title="isTrailerOnly ? 'Phim chưa có tập để xem' : ''">
                  <Play :size="20" />
                  {{ isTrailerOnly ? 'Chỉ có Trailer' : (selectedEpisode ? `Xem Tập ${selectedEpisode.name}` : 'Xem phim') }}
                </button>
                <button @click="toggleWatchlist" :class="['btn', 'btn-secondary', { 'btn-watchlist-active': isInWatchlist }]">
                  <Heart :size="20" :fill="isInWatchlist ? 'currentColor' : 'none'" />
                  {{ isInWatchlist ? 'Bỏ yêu thích' : 'Yêu thích' }}
                </button>
              </div>
              
              <!-- Episodes Section -->
              <div v-if="episodes.length > 0" class="episodes-section">
                <h3>Danh sách tập phim</h3>
                
                <!-- Server Tabs -->
                <div v-if="episodes.length > 1" class="server-tabs">
                  <button
                    v-for="(server, index) in episodes"
                    :key="index"
                    @click="selectServer(index)"
                    :class="['server-tab', { active: selectedServer === index }]"
                  >
                    {{ server.server_name }}
                  </button>
                </div>
                
                <!-- Episodes Grid -->
                <div class="episodes-grid">
                  <button
                    v-for="ep in episodes[selectedServer]?.server_data || []"
                    :key="ep.slug"
                    @click="selectEpisode(ep)"
                    :class="['episode-btn', { 
                      active: selectedEpisode?.slug === ep.slug,
                      'is-ai': episodes[selectedServer]?.is_ai
                    }]"
                    :title="ep.filename"
                  >
                    Tập {{ ep.name }}
                  </button>
                </div>
              </div>
              
              <!-- Description -->
              <div v-if="movie.content" class="movie-description">
                <h3>Nội dung</h3>
                <div v-html="movie.content"></div>
              </div>
              
              <!-- Additional Info -->
              <div class="additional-info">
                <div v-if="movie.actor?.length" class="info-row">
                  <strong>Diễn viên:</strong>
                  <span>{{ movie.actor.join(', ') }}</span>
                </div>
                <div v-if="movie.director?.length" class="info-row">
                  <strong>Đạo diễn:</strong>
                  <span>{{ movie.director.join(', ') }}</span>
                </div>
                <div v-if="movie.quality" class="info-row">
                  <strong>Chất lượng:</strong>
                  <span>{{ movie.quality }}</span>
                </div>
                <div v-if="movie.lang" class="info-row">
                  <strong>Ngôn ngữ:</strong>
                  <span>{{ movie.lang }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Images Gallery -->
          <div v-if="images.length" class="images-gallery">
            <h3>Hình ảnh ({{ images.length }})</h3>
            <div class="gallery-grid">
              <img 
                v-for="(image, index) in images" 
                :key="index"
                :src="image" 
                :alt="`${movie.name} - Image ${index + 1}`"
                class="gallery-image"
                loading="lazy"
                @error="(e) => e.target.style.display = 'none'"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.movie-detail-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.detail-content {
  min-height: 100vh;
  padding-top: 80px;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--space-2xl);
}

.error-message {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
}

.btn-back {
  padding: var(--space-md) var(--space-xl);
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn-back:hover {
  background: var(--primary-dark);
}

.movie-detail-container {
  position: relative;
}

.backdrop-container {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(16, 20, 31, 0.3),
    rgba(16, 20, 31, 0.9),
    var(--bg-primary)
  );
  z-index: 1;
}

.backdrop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-xl);
}

.detail-wrapper {
  position: relative;
  margin-top: -200px;
  z-index: 2;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-2xl);
  margin-bottom: var(--space-3xl);
}

.poster-section {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.movie-poster {
  width: 100%;
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}

.info-section {
  color: var(--text-primary);
}

.movie-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--space-sm);
  line-height: 1.2;
}

.movie-origin-name {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.movie-meta span {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 1rem;
  color: var(--text-secondary);
}

.rating {
  color: var(--accent) !important;
  font-weight: 600;
  font-size: 1.1rem !important;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.genre-tag {
  padding: var(--space-xs) var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  color: var(--text-primary);
}

.countries {
  margin-bottom: var(--space-lg);
  color: var(--text-secondary);
}

.countries strong {
  color: var(--text-primary);
  margin-right: var(--space-sm);
}

.action-buttons {
  display: flex;
  gap: var(--space-md);
  margin: var(--space-xl) 0;
}

.btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-play {
  background: var(--primary);
  color: white;
}

.btn-play:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-play:disabled {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-play:disabled:hover {
  transform: none;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

.btn-watchlist-active {
  background: linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(139, 0, 139, 0.2)) !important;
  border: 2px solid var(--accent-primary) !important;
  color: var(--accent-primary) !important;
}

.btn-watchlist-active:hover {
  background: linear-gradient(135deg, rgba(229, 9, 20, 0.3), rgba(139, 0, 139, 0.3)) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4);
}

/* Episodes Section */
.episodes-section {
  margin: var(--space-2xl) 0;
  padding: var(--space-xl);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.episodes-section h3 {
  font-size: 1.25rem;
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
}

.server-tabs {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.server-tab {
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.server-tab:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.server-tab.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--space-sm);
  max-height: 400px;
  overflow-y: auto;
  padding: var(--space-sm);
}

.episode-btn {
  padding: var(--space-md);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.episode-btn:hover {
  background: var(--bg-primary);
  border-color: var(--accent-primary);
}

.episode-btn.active {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}

.episode-btn.is-ai {
  position: relative;
}

.episode-btn.is-ai::after {
  content: '🤖';
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.7rem;
}

.movie-description {
  margin: var(--space-xl) 0;
}

.movie-description h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-md);
  color: var(--text-primary);
}

.movie-description :deep(p) {
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.additional-info {
  margin-top: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.info-row {
  display: flex;
  gap: var(--space-md);
  color: var(--text-secondary);
}

.info-row strong {
  color: var(--text-primary);
  min-width: 120px;
}

.images-gallery {
  margin-top: var(--space-3xl);
  padding-top: var(--space-2xl);
  border-top: 1px solid var(--bg-secondary);
}

.images-gallery h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-xl);
  color: var(--text-primary);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-md);
}

.gallery-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: var(--radius-md);
  transition: transform 0.3s;
  cursor: pointer;
}

.gallery-image:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .detail-wrapper {
    grid-template-columns: 1fr;
    margin-top: -100px;
  }
  
  .poster-section {
    position: relative;
    top: 0;
    max-width: 250px;
    margin: 0 auto;
  }
  
  .movie-title {
    font-size: 2rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
