<script setup>
import { onMounted } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import HeroBanner from '../components/home/HeroBanner.vue'
import MovieCarousel from '../components/home/MovieCarousel.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import ToastNotification from '../components/shared/ToastNotification.vue'
import { useMovieStore } from '../stores/movieStore'

const movieStore = useMovieStore()

onMounted(async () => {
  // Fetch data for homepage
  try {
    await Promise.all([
      movieStore.fetchTrending(),
      movieStore.fetchTopRated(),
      movieStore.fetchGenres()
    ])
  } catch (error) {
    console.error('Error loading homepage:', error)
  }
})
</script>

<template>
  <div class="home-page">
    <AppHeader />
    <ToastNotification />
    
    <main class="home-content">
      <!-- Loading State -->
      <div v-if="movieStore.loading" class="loading-container">
        <LoadingSpinner size="large" />
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Hero Banner -->
        <HeroBanner 
          v-if="movieStore.trending && movieStore.trending.length > 0"
          :movies="movieStore.trending.slice(0, 5)" 
        />

        <!-- Content Sections -->
        <div class="content-sections">
          <!-- Trending -->
          <MovieCarousel 
            v-if="movieStore.trending && movieStore.trending.length > 0"
            title="🔥 Trending Now"
            :movies="movieStore.trending"
          />

          <!-- Top Rated -->
          <MovieCarousel 
            v-if="movieStore.topRated && movieStore.topRated.length > 0"
            title="🏆 Top 10 Phim Hôm Nay"
            :movies="movieStore.topRated"
          />

          <!-- Continue Watching (if logged in) -->
          <MovieCarousel 
            v-if="movieStore.continueWatching && movieStore.continueWatching.length > 0"
            title="📺 Tiếp Tục Xem"
            :movies="movieStore.continueWatching"
          />

          <!-- Genres -->
          <MovieCarousel 
            v-for="genre in (movieStore.genres && Array.isArray(movieStore.genres) ? movieStore.genres.slice(0, 5) : [])" 
            :key="genre._id || genre.slug"
            :title="`${genre.icon || '🎬'} ${genre.name}`"
            :movies="movieStore.moviesByGenre[genre.slug] || []"
          />
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.home-content {
  padding-top: 80px; /* Space for fixed header */
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--space-3xl);
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
  padding: var(--space-2xl) 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: var(--space-2xl);
}
</style>
