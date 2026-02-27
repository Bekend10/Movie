<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Play, Info } from 'lucide-vue-next'
import { useMovieStore } from '../../stores/movieStore'
import { getThumbUrl } from '../../composables/useImageUtils'

const props = defineProps({
  movies: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
const movieStore = useMovieStore()
const currentIndex = ref(0)
let intervalId = null

// Auto-rotate slides
const startAutoRotate = () => {
  intervalId = setInterval(() => {
    nextSlide()
  }, 8000)
}

const stopAutoRotate = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const nextSlide = () => {
  if (props.movies.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.movies.length
}

const goToSlide = (index) => {
  currentIndex.value = index
  stopAutoRotate()
  startAutoRotate()
}

const watchNow = () => {
  if (currentMovie.value) {
    const slug = currentMovie.value.slug || currentMovie.value._id || currentMovie.value.id
    router.push(`/watch/${slug}`)
  }
}

const moreInfo = () => {
  if (currentMovie.value) {
    const slug = currentMovie.value.slug || currentMovie.value._id || currentMovie.value.id
    router.push(`/movie/${slug}`)
  }
}

const currentMovie = computed(() => {
  return props.movies[currentIndex.value]
})

const currentMovieBackdrop = computed(() => {
  if (!currentMovie.value) return '/placeholder.jpg'
  // Try thumb_url first, then poster_url
  return getThumbUrl(currentMovie.value, movieStore.cdnDomain)
})

const isTrailerOnly = computed(() => {
  // Check if current movie only has trailer
  if (!currentMovie.value) return false
  if (currentMovie.value?.episode_current?.toLowerCase().includes('trailer')) return true
  return false
})

onMounted(() => {
  if (props.movies.length > 0) {
    startAutoRotate()
  }
})

onUnmounted(() => {
  stopAutoRotate()
})
</script>

<script>
import { computed } from 'vue'
export default {
  name: 'HeroBanner'
}
</script>

<template>
  <section class="hero-banner">
    <Transition name="fade" mode="out-in">
      <div v-if="currentMovie" :key="currentIndex" class="hero-slide">
        <!-- Background Image -->
        <div class="hero-background">
          <img 
            :src="currentMovieBackdrop" 
            :alt="currentMovie.name || currentMovie.title"
            loading="eager"
          />
          <div class="hero-gradient"></div>
        </div>

        <!-- Content -->
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">{{ currentMovie.name || currentMovie.title }}</h1>
            
            <div class="hero-meta">
              <span class="rating">★ {{ currentMovie.tmdb?.vote_average || currentMovie.rating || '8.5' }}</span>
              <span class="year">{{ currentMovie.year || '2024' }}</span>
              <span class="duration">{{ currentMovie.time || currentMovie.duration || '2h 15m' }}</span>
            </div>

            <div class="hero-actions">
              <button class="btn btn-primary" @click="watchNow" :disabled="isTrailerOnly" :title="isTrailerOnly ? 'Phim chưa có tập để xem' : ''">
                <Play :size="20" />
                {{ isTrailerOnly ? 'Chỉ có Trailer' : 'Xem Ngay' }}
              </button>
              <button class="btn btn-secondary" @click="moreInfo">
                <Info :size="20" />
                Thêm Thông Tin
              </button>
            </div>
          </div>
        </div>

        <!-- Indicators -->
        <div class="hero-indicators">
          <button
            v-for="(movie, index) in movies"
            :key="movie.id || index"
            class="indicator"
            :class="{ active: index === currentIndex }"
            @click="goToSlide(index)"
            :aria-label="`Slide ${index + 1}`"
          ></button>
        </div>
      </div>
    </Transition>

    <!-- Fallback when no movies -->
    <div v-if="!currentMovie" class="hero-fallback">
      <div class="container">
        <h1>Chào mừng đến với MovieApp</h1>
        <p>Khám phá hàng ngàn bộ phim hấp dẫn</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-banner {
  position: relative;
  width: 100vw;
  height: 65vh;
  min-height: 450px;
  max-height: 700px;
  overflow: hidden;
  margin-left: calc(-50vw + 50%);
}

.hero-slide {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Background */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  filter: brightness(0.7);
}

.hero-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
  background: linear-gradient(
    to top,
    var(--bg-primary) 0%,
    rgba(0, 0, 0, 0.8) 50%,
    transparent 100%
  );
}

/* Content */
.hero-content {
  position: relative;
  z-index: 10;
  max-width: 650px;
  padding-top: 18vh;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: var(--font-size-hero);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 0, 0, 0.5);
  line-height: 1.1;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
}

.rating {
  color: var(--accent-gold);
  font-weight: 600;
}

.hero-description {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: var(--space-2xl);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.9);
  max-width: 600px;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.btn {
  padding: var(--space-md) var(--space-2xl);
  font-size: var(--font-size-base);
  font-weight: 600;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-primary), #b00916);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(229, 9, 20, 0.4);
}

.btn-primary:disabled {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary:disabled:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* Indicators */
.hero-indicators {
  position: absolute;
  bottom: var(--space-2xl);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-sm);
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  cursor: pointer;
}

.indicator.active {
  background-color: var(--accent-primary);
  border-color: var(--accent-primary);
  width: 30px;
  border-radius: var(--radius-md);
}

.indicator:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.7);
  transform: scale(1.2);
}

/* Fallback */
.hero-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  text-align: center;
}

.hero-fallback h1 {
  font-size: var(--font-size-hero);
  margin-bottom: var(--space-md);
}

.hero-fallback p {
  font-size: var(--font-size-xl);
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-banner {
    height: 55vh;
    min-height: 400px;
    max-height: 600px;
  }

  .hero-content {
    padding-top: 18vh;
    max-width: 100%;
  }

  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .hero-description {
    font-size: var(--font-size-base);
    -webkit-line-clamp: 2;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .hero-indicators {
    bottom: var(--space-lg);
  }
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
