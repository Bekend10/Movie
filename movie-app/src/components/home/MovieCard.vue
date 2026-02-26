<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Play, Plus, ThumbsUp } from 'lucide-vue-next'
import { useWatchlistStore } from '../../stores/watchlistStore'
import { useUIStore } from '../../stores/uiStore'
import { useMovieStore } from '../../stores/movieStore'
import { useAuthStore } from '../../stores/authStore'
import { getPosterUrl } from '../../composables/useImageUtils'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const watchlistStore = useWatchlistStore()
const uiStore = useUIStore()
const movieStore = useMovieStore()
const authStore = useAuthStore()
const isHovered = ref(false)
const imageLoaded = ref(false)

const movieSlug = computed(() => props.movie.slug || props.movie._id || props.movie.id)
const posterUrl = computed(() => {
  // Pass CDN domain from store to getPosterUrl
  return getPosterUrl(props.movie, movieStore.cdnDomain)
})

const goToDetail = () => {
  router.push(`/movie/${movieSlug.value}`)
}

const playMovie = (e) => {
  e.stopPropagation()
  router.push(`/watch/${movieSlug.value}`)
}

const toggleWatchlist = async (e) => {
  e.stopPropagation()
  
  // Check if user is logged in
  if (!authStore.isLoggedIn) {
    uiStore.showToast('Vui lòng đăng nhập để thêm vào yêu thích', 'warning')
    router.push('/login')
    return
  }

  try {
    if (watchlistStore.isInWatchlist(movieSlug.value)) {
      await watchlistStore.removeFromWatchlist(movieSlug.value)
      uiStore.showToast('Đã xóa khỏi danh sách yêu thích', 'info')
    } else {
      // Prepare movie object with full image URL
      const movieToSave = {
        ...props.movie,
        full_poster_url: posterUrl.value,
        full_thumb_url: posterUrl.value
      }
      
      watchlistStore.addToWatchlist(movieToSave)
      uiStore.showToast('Đã thêm vào danh sách yêu thích', 'success')
    }
  } catch (error) {
    uiStore.showToast('Có lỗi xảy ra', 'error')
  }
}

const likeMovie = (e) => {
  e.stopPropagation()
  uiStore.showToast('Cảm ơn bạn đã đánh giá', 'success')
}

const onImageLoad = () => {
  imageLoaded.value = true
}
</script>

<template>
  <div 
    class="movie-card"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="goToDetail"
  >
    <!-- Poster -->
    <div class="card-poster">
      <div v-if="!imageLoaded" class="skeleton shimmer"></div>
      <img 
        :src="posterUrl" 
        :alt="movie.name || movie.title"
        loading="lazy"
        @load="onImageLoad"
        :style="{ opacity: imageLoaded ? 1 : 0 }"
      />
      
      <!-- Overlay - Show on hover -->
      <Transition name="fade">
        <div v-if="isHovered" class="card-overlay">
          <!-- Info -->
          <div class="overlay-info">
            <h3 class="movie-title">{{ movie.name || movie.title }}</h3>
            <div class="movie-meta">
              <span class="rating">★ {{ movie.tmdb?.vote_average || movie.rating || '8.5' }}</span>
              <span class="year">{{ movie.year || '2024' }}</span>
            </div>
            <div class="movie-genres">
              <span 
                v-for="genre in ((movie.category || movie.genres || []).slice(0, 2))" 
                :key="genre.slug || genre._id || genre"
                class="genre-tag"
              >
                {{ genre.name || genre }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="overlay-actions">
            <button class="action-btn play-btn" @click="playMovie" title="Xem phim">
              <Play :size="18" />
            </button>
            <button class="action-btn" @click="toggleWatchlist" title="Thêm vào danh sách">
              <Plus :size="18" />
            </button>
            <button class="action-btn" @click="likeMovie" title="Thích">
              <ThumbsUp :size="18" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  position: relative;
  width: 200px;
  flex-shrink: 0;
  scroll-snap-align: start;
  cursor: pointer;
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition-base);
}

.movie-card:hover {
  transform: scale(1.05);
  z-index: 10;
  box-shadow: var(--shadow-lg);
}

/* Poster */
.card-poster {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.card-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: var(--transition-base);
}

.movie-card:hover .card-poster img {
  transform: scale(1.1);
}

.skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--bg-card) 0%,
    var(--bg-elevated) 50%,
    var(--bg-card) 100%
  );
  background-size: 200% 100%;
}

.shimmer {
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Overlay */
.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-md);
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.7) 60%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* Info */
.overlay-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.movie-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.rating {
  color: var(--accent-gold);
  font-weight: 600;
}

.movie-genres {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.genre-tag {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
}

/* Actions */
.overlay-actions {
  display: flex;
  gap: var(--space-sm);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  backdrop-filter: blur(10px);
  transition: var(--transition-fast);
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.play-btn {
  background-color: var(--accent-primary);
}

.play-btn:hover {
  background-color: var(--accent-hover);
}

/* Responsive */
@media (max-width: 768px) {
  .movie-card {
    width: 140px;
  }

  .movie-card:hover {
    transform: scale(1.02);
  }

  .movie-title {
    font-size: var(--font-size-sm);
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }
}
</style>
