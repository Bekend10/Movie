<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Filter, Grid, List, ChevronDown } from 'lucide-vue-next'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ToastNotification from '../components/shared/ToastNotification.vue'
import MovieCard from '../components/home/MovieCard.vue'
import MovieCarousel from '../components/home/MovieCarousel.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import movieService from '../services/movieService'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const movies = ref([])
const genres = ref([])
const genreMovies = ref({}) // { genreSlug: { name: '', items: [] } }
const currentPage = ref(1)
const totalPages = ref(1)
const viewMode = ref('grid') // 'grid' or 'list'
const selectedGenre = ref('all')

// Get page type from query param
const pageType = computed(() => route.query.type || 'movies')
const isSeriesMode = computed(() => pageType.value === 'series')

const pageTitle = computed(() => {
  if (isSeriesMode.value) {
    return 'Series TV'
  }
  return 'Phim Mới'
})

const pageSubtitle = computed(() => {
  if (isSeriesMode.value) {
    return 'Khám phá các series TV theo thể loại'
  }
  return 'Cập nhật phim mới nhất mỗi ngày'
})

// Load movies for "phim-moi" mode
const loadNewMovies = async (page = 1) => {
  loading.value = true
  
  try {
    const response = await movieService.getMoviesList('phim-moi', {
      page,
      limit: 24,
      sort_field: 'modified.time',
      sort_type: 'desc'
    })
    
    if (response.status === 'success' && response.data) {
      movies.value = response.data.items || []
      
      const pagination = response.data.params?.pagination
      if (pagination) {
        currentPage.value = pagination.currentPage || 1
        totalPages.value = Math.ceil((pagination.totalItems || 0) / (pagination.totalItemsPerPage || 24))
      }
    }
  } catch (err) {
    console.error('Error loading new movies:', err)
    movies.value = []
  } finally {
    loading.value = false
  }
}

// Load genres and movies for "series" mode
const loadSeriesByGenres = async () => {
  loading.value = true
  console.log('Loading series by genres...')
  
  try {
    // First, get all genres
    const genresResponse = await movieService.getGenres()
    console.log('Genres response:', genresResponse)
    
    if (genresResponse.status === 'success' && genresResponse.data) {
      // Fix: API trả về data.items, không phải data trực tiếp
      const genresList = genresResponse.data.items || genresResponse.data
      genres.value = Array.isArray(genresList) ? genresList : []
      console.log('Genres loaded:', genres.value.length)
      
      if (genres.value.length === 0) {
        console.error('No genres found in response')
        loading.value = false
        return
      }
      
      // Load movies for each genre (first 12 items each)
      const genrePromises = genres.value.slice(0, 10).map(async (genre) => {
        try {
          console.log(`Loading movies for genre: ${genre.name} (${genre.slug})`)
          const response = await movieService.getMoviesByGenre(genre.slug, {
            page: 1,
            limit: 12,
            sort_field: 'modified.time',
            sort_type: 'desc'
          })
          
          if (response.status === 'success' && response.data) {
            console.log(`Genre ${genre.slug}: ${response.data.items?.length || 0} movies`)
            return {
              slug: genre.slug,
              name: genre.name,
              items: response.data.items || []
            }
          }
          return null
        } catch (err) {
          console.error(`Error loading genre ${genre.slug}:`, err)
          return null
        }
      })
      
      const results = await Promise.all(genrePromises)
      console.log('All genre results:', results.filter(r => r !== null).length)
      
      // Build genreMovies object
      genreMovies.value = {}
      results.forEach(result => {
        if (result && result.items.length > 0) {
          genreMovies.value[result.slug] = result
        }
      })
      
      console.log('Genre movies loaded:', Object.keys(genreMovies.value).length)
    }
  } catch (err) {
    console.error('Error loading series by genres:', err)
  } finally {
    loading.value = false
  }
}

// Load single genre movies
const loadGenreMovies = async (genreSlug, page = 1) => {
  loading.value = true
  
  try {
    const response = await movieService.getMoviesByGenre(genreSlug, {
      page,
      limit: 24,
      sort_field: 'modified.time',
      sort_type: 'desc'
    })
    
    if (response.status === 'success' && response.data) {
      movies.value = response.data.items || []
      
      const pagination = response.data.params?.pagination
      if (pagination) {
        currentPage.value = pagination.currentPage || 1
        totalPages.value = Math.ceil((pagination.totalItems || 0) / (pagination.totalItemsPerPage || 24))
      }
    }
  } catch (err) {
    console.error('Error loading genre movies:', err)
    movies.value = []
  } finally {
    loading.value = false
  }
}

// Handle genre filter change
const handleGenreChange = (genreSlug) => {
  selectedGenre.value = genreSlug
  currentPage.value = 1
  
  if (genreSlug === 'all') {
    loadSeriesByGenres()
  } else {
    loadGenreMovies(genreSlug, 1)
  }
}

// Pagination
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  
  currentPage.value = page
  
  if (isSeriesMode.value && selectedGenre.value !== 'all') {
    loadGenreMovies(selectedGenre.value, page)
  } else if (!isSeriesMode.value) {
    loadNewMovies(page)
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Load data based on page type
const loadData = () => {
  console.log('Loading data, pageType:', pageType.value, 'isSeriesMode:', isSeriesMode.value)
  
  if (isSeriesMode.value) {
    loadSeriesByGenres()
  } else {
    loadNewMovies(1)
  }
}

// Watch for route changes
watch(() => route.query.type, (newType) => {
  console.log('Route query changed, type:', newType)
  selectedGenre.value = 'all'
  currentPage.value = 1
  genreMovies.value = {}
  movies.value = []
  loadData()
}, { immediate: false })

watch(() => route.path, () => {
  // Reset when navigating away and back
  if (route.path === '/browse') {
    selectedGenre.value = 'all'
    currentPage.value = 1
  }
})

onMounted(() => {
  console.log('BrowsePage mounted, initial type:', route.query.type)
  loadData()
})
</script>

<template>
  <div class="browse-page">
    <AppHeader />
    <ToastNotification />
    
    <main class="browse-content">
      <div class="container">
        <!-- Page Header -->
        <div class="page-header">
          <div class="header-text">
            <h1 class="page-title">{{ pageTitle }}</h1>
            <p class="page-subtitle">{{ pageSubtitle }}</p>
          </div>
          
          <!-- Genre Filter (for series mode with selected genre) -->
          <div v-if="isSeriesMode && genres.length > 0" class="genre-filter">
            <label for="genre-select">Thể loại:</label>
            <select
              id="genre-select"
              v-model="selectedGenre"
              @change="handleGenreChange(selectedGenre)"
              class="genre-select"
            >
              <option value="all">Tất cả thể loại</option>
              <option
                v-for="genre in genres"
                :key="genre.slug"
                :value="genre.slug"
              >
                {{ genre.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-container">
          <LoadingSpinner />
          <p>Đang tải {{ isSeriesMode ? 'series' : 'phim' }}...</p>
        </div>

        <!-- Series Mode - Grouped by Genre -->
        <template v-else-if="isSeriesMode && selectedGenre === 'all'">
          <div v-if="Object.keys(genreMovies).length === 0" class="empty-state">
            <div class="empty-icon">🎬</div>
            <h3>Không có series nào</h3>
            <p>Đang cập nhật thêm series...</p>
          </div>
          
          <div v-else class="series-by-genre">
            <div
              v-for="(genreData, slug) in genreMovies"
              :key="slug"
              class="genre-section"
            >
              <MovieCarousel
                :title="genreData.name"
                :movies="genreData.items"
                :viewAll="true"
                @view-all="handleGenreChange(slug)"
              />
            </div>
          </div>
        </template>

        <!-- Grid View (New Movies or Single Genre) -->
        <div v-else-if="!loading && movies.length > 0" class="movies-section">
          <div class="movies-grid">
            <MovieCard
              v-for="movie in movies"
              :key="movie._id"
              :movie="movie"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              Trước
            </button>
            
            <div class="pagination-numbers">
              <button
                v-for="page in Math.min(totalPages, 10)"
                :key="page"
                @click="goToPage(page)"
                :class="['pagination-number', { active: currentPage === page }]"
              >
                {{ page }}
              </button>
              <span v-if="totalPages > 10" class="pagination-dots">...</span>
            </div>
            
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Sau
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading" class="empty-state">
          <div class="empty-icon">🎬</div>
          <h3>Không có phim nào</h3>
          <p>Chưa có phim nào trong danh mục này</p>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.browse-content {
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
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
}

/* Genre Filter */
.genre-filter {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.6), rgba(20, 20, 40, 0.8));
  padding: var(--space-lg) var(--space-xl);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.genre-filter label {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: var(--font-size-base);
  white-space: nowrap;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: var(--font-size-sm);
}

.genre-select {
  min-width: 260px;
  padding: var(--space-md) var(--space-lg);
  padding-right: 48px;
  background: linear-gradient(135deg, rgba(40, 40, 60, 0.9), rgba(30, 30, 50, 0.9));
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23E50914' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.genre-select:hover {
  border-color: var(--accent-primary);
  background: linear-gradient(135deg, rgba(50, 50, 70, 0.95), rgba(40, 40, 60, 0.95));
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(229, 9, 20, 0.25), 0 4px 12px rgba(0, 0, 0, 0.4);
}

.genre-select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.2), 0 8px 24px rgba(229, 9, 20, 0.3);
  transform: translateY(-2px);
}

.genre-select option {
  background: #1a1a2e;
  color: var(--text-primary);
  padding: 12px 16px;
  font-weight: 500;
  font-size: var(--font-size-base);
  transition: all 0.2s;
}

.genre-select option:hover {
  background: linear-gradient(90deg, rgba(229, 9, 20, 0.2), rgba(229, 9, 20, 0.1));
  color: var(--accent-primary);
}

.genre-select option:checked {
  background: linear-gradient(90deg, var(--accent-primary), rgba(229, 9, 20, 0.8));
  color: white;
  font-weight: 700;
}

/* Custom Scrollbar for Dropdown (Webkit browsers) */
.genre-select::-webkit-scrollbar {
  width: 8px;
}

.genre-select::-webkit-scrollbar-track {
  background: rgba(20, 20, 30, 0.5);
  border-radius: 4px;
}

.genre-select::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--accent-primary), rgba(229, 9, 20, 0.6));
  border-radius: 4px;
  transition: all 0.3s;
}

.genre-select::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
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

/* Series by Genre */
.series-by-genre {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

.genre-section {
  margin-bottom: var(--space-xl);
}

/* Movies Grid */
.movies-section {
  margin-top: var(--space-xl);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
}

.pagination-btn {
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--bg-card);
  border-color: var(--accent-primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.pagination-number {
  min-width: 40px;
  height: 40px;
  padding: var(--space-sm);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-number:hover {
  background: var(--bg-card);
  border-color: var(--accent-primary);
}

.pagination-number.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

.pagination-dots {
  color: var(--text-secondary);
  padding: 0 var(--space-sm);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-3xl);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: var(--space-lg);
  opacity: 0.5;
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
}

/* Responsive */
@media (max-width: 768px) {
  .browse-content {
    padding-top: 80px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }

  .genre-filter {
    width: 100%;
  }

  .genre-select {
    flex: 1;
    min-width: auto;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-md);
  }

  .pagination {
    flex-wrap: wrap;
  }

  .pagination-numbers {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: var(--space-sm);
  }
}
</style>
