<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, X, Filter, TrendingUp } from 'lucide-vue-next'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ToastNotification from '../components/shared/ToastNotification.vue'
import MovieCard from '../components/home/MovieCard.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import movieService from '../services/movieService'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const searchResults = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalResults = ref(0)
const showFilters = ref(false)

// Popular searches (có thể lấy từ localStorage hoặc backend)
const popularSearches = ref([
  'Avengers',
  'Spider-Man',
  'One Piece',
  'Naruto',
  'Doraemon',
  'Conan',
  'Harry Potter',
  'Fast & Furious'
])

// Recent searches (lưu trong localStorage)
const recentSearches = ref([])

const hasResults = computed(() => searchResults.value.length > 0)
const showEmptyState = computed(() => !loading.value && searchQuery.value && !hasResults.value)

// Load recent searches from localStorage
const loadRecentSearches = () => {
  try {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  } catch (err) {
    console.error('Error loading recent searches:', err)
  }
}

// Save search to recent searches
const saveToRecentSearches = (query) => {
  if (!query || query.trim() === '') return
  
  const trimmedQuery = query.trim()
  
  // Remove if already exists
  recentSearches.value = recentSearches.value.filter(s => s !== trimmedQuery)
  
  // Add to beginning
  recentSearches.value.unshift(trimmedQuery)
  
  // Keep only 10 recent searches
  recentSearches.value = recentSearches.value.slice(0, 10)
  
  // Save to localStorage
  try {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
  } catch (err) {
    console.error('Error saving recent searches:', err)
  }
}

// Clear recent searches
const clearRecentSearches = () => {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}

// Search movies
const searchMovies = async (page = 1) => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  loading.value = true
  
  try {
    const response = await movieService.search(searchQuery.value.trim(), page)
    
    if (response.status === 'success' && response.data) {
      searchResults.value = response.data.items || []
      
      // Get pagination info
      const pagination = response.data.params?.pagination
      if (pagination) {
        currentPage.value = pagination.currentPage || 1
        totalPages.value = Math.ceil((pagination.totalItems || 0) / (pagination.totalItemsPerPage || 24))
        totalResults.value = pagination.totalItems || 0
      }
      
      // Save to recent searches
      saveToRecentSearches(searchQuery.value)
    } else {
      searchResults.value = []
      totalResults.value = 0
    }
  } catch (err) {
    console.error('Search error:', err)
    searchResults.value = []
    totalResults.value = 0
  } finally {
    loading.value = false
  }
}

// Handle search submit
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    currentPage.value = 1
    router.push({ query: { q: searchQuery.value.trim() } })
  }
}

// Handle quick search (from suggestions)
const handleQuickSearch = (query) => {
  searchQuery.value = query
  handleSearch()
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  router.push({ query: {} })
}

// Handle pagination
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  searchMovies(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch route query changes
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery
    searchMovies(1)
  } else {
    searchQuery.value = ''
    searchResults.value = []
  }
}, { immediate: true })

onMounted(() => {
  loadRecentSearches()
})
</script>

<template>
  <div class="search-page">
    <AppHeader />
    <ToastNotification />
    
    <main class="search-content">
      <div class="container">
        <!-- Search Header -->
        <div class="search-header">
          <h1 class="page-title">Tìm kiếm phim</h1>
          <p class="page-subtitle">Khám phá hàng ngàn bộ phim yêu thích của bạn</p>
        </div>

        <!-- Search Bar -->
        <div class="search-bar-container">
          <div class="search-bar">
            <Search class="search-icon" :size="24" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm phim, diễn viên, đạo diễn..."
              class="search-input"
              @keyup.enter="handleSearch"
              autofocus
            />
            <button 
              v-if="searchQuery" 
              @click="clearSearch" 
              class="clear-btn"
              title="Xóa"
            >
              <X :size="20" />
            </button>
            <button @click="handleSearch" class="search-submit-btn">
              Tìm kiếm
            </button>
          </div>
        </div>

        <!-- Search Suggestions (when no query) -->
        <div v-if="!searchQuery && !loading" class="search-suggestions">
          <!-- Recent Searches -->
          <div v-if="recentSearches.length > 0" class="suggestion-section">
            <div class="suggestion-header">
              <h3>Tìm kiếm gần đây</h3>
              <button @click="clearRecentSearches" class="clear-all-btn">
                Xóa tất cả
              </button>
            </div>
            <div class="suggestion-chips">
              <button
                v-for="(search, index) in recentSearches"
                :key="index"
                @click="handleQuickSearch(search)"
                class="suggestion-chip"
              >
                {{ search }}
              </button>
            </div>
          </div>

          <!-- Popular Searches -->
          <div class="suggestion-section">
            <div class="suggestion-header">
              <h3>
                <TrendingUp :size="20" />
                Tìm kiếm phổ biến
              </h3>
            </div>
            <div class="suggestion-chips">
              <button
                v-for="(search, index) in popularSearches"
                :key="index"
                @click="handleQuickSearch(search)"
                class="suggestion-chip popular"
              >
                {{ search }}
              </button>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-container">
          <LoadingSpinner />
          <p>Đang tìm kiếm...</p>
        </div>

        <!-- Search Results -->
        <div v-else-if="hasResults" class="search-results">
          <div class="results-header">
            <h2>Kết quả tìm kiếm: "{{ searchQuery }}"</h2>
            <p class="results-count">Tìm thấy {{ totalResults }} kết quả</p>
          </div>

          <div class="movies-grid">
            <MovieCard
              v-for="movie in searchResults"
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
        <div v-else-if="showEmptyState" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Không tìm thấy kết quả</h3>
          <p>Không tìm thấy phim nào cho "{{ searchQuery }}"</p>
          <p class="empty-hint">Hãy thử:</p>
          <ul class="empty-suggestions">
            <li>Kiểm tra lỗi chính tả</li>
            <li>Sử dụng từ khóa khác</li>
            <li>Tìm kiếm theo tên tiếng Anh</li>
          </ul>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.search-content {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: var(--space-3xl);
}

.search-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
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

/* Search Bar */
.search-bar-container {
  max-width: 800px;
  margin: 0 auto var(--space-3xl);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: var(--bg-elevated);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-sm) var(--space-lg);
  transition: all 0.3s;
}

.search-bar:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.1);
}

.search-icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  padding: var(--space-sm) 0;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.clear-btn {
  padding: var(--space-sm);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background: var(--bg-card);
  color: var(--text-primary);
}

.search-submit-btn {
  padding: var(--space-md) var(--space-xl);
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.search-submit-btn:hover {
  background: var(--accent-primary-dark);
  transform: translateY(-1px);
}

/* Search Suggestions */
.search-suggestions {
  max-width: 800px;
  margin: 0 auto;
}

.suggestion-section {
  margin-bottom: var(--space-2xl);
}

.suggestion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.suggestion-header h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.clear-all-btn {
  padding: var(--space-xs) var(--space-md);
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.suggestion-chip {
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-chip:hover {
  background: var(--bg-card);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

.suggestion-chip.popular {
  background: linear-gradient(135deg, rgba(229, 9, 20, 0.1), rgba(229, 9, 20, 0.05));
  border-color: rgba(229, 9, 20, 0.3);
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl);
  gap: var(--space-lg);
}

.loading-container p {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
}

/* Search Results */
.search-results {
  margin-top: var(--space-2xl);
}

.results-header {
  margin-bottom: var(--space-xl);
}

.results-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.results-count {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
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
  max-width: 600px;
  margin: 0 auto;
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
  margin-bottom: var(--space-md);
}

.empty-hint {
  font-weight: 600;
  color: var(--text-primary);
  margin-top: var(--space-xl);
}

.empty-suggestions {
  list-style: none;
  padding: 0;
  margin: var(--space-md) 0 0;
  display: inline-block;
  text-align: left;
}

.empty-suggestions li {
  padding: var(--space-xs) 0;
  color: var(--text-secondary);
}

.empty-suggestions li::before {
  content: "• ";
  color: var(--accent-primary);
  font-weight: bold;
  margin-right: var(--space-sm);
}

/* Responsive */
@media (max-width: 768px) {
  .search-content {
    padding-top: 80px;
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }

  .search-bar {
    padding: var(--space-xs) var(--space-md);
  }

  .search-input {
    font-size: var(--font-size-base);
  }

  .search-submit-btn {
    padding: var(--space-sm) var(--space-lg);
    font-size: var(--font-size-sm);
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
