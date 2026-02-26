import { defineStore } from 'pinia'
import { ref } from 'vue'
import movieService from '../services/movieService'

export const useMovieStore = defineStore('movie', () => {
  // State
  const trending = ref([])
  const topRated = ref([])
  const genres = ref([])
  const countries = ref([])
  const moviesByGenre = ref({})
  const currentMovie = ref(null)
  const continueWatching = ref([])
  const searchResults = ref([])
  const loading = ref(false)
  const error = ref(null)
  const cdnDomain = ref('https://img.ophim.cc/uploads/movies/')  // Default CDN

  // Actions
  async function fetchTrending(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getTrending(page)
      
      // Save CDN domain if available
      if (response.data?.APP_DOMAIN_CDN_IMAGE) {
        cdnDomain.value = response.data.APP_DOMAIN_CDN_IMAGE
      }
      
      // OPhim API returns data in specific format
      if (response.status === 'success' && response.data) {
        trending.value = Array.isArray(response.data.items) ? response.data.items : []
        return {
          items: trending.value,
          pagination: response.data.params?.pagination || {}
        }
      }
      
      trending.value = []
      return { items: [], pagination: {} }
    } catch (err) {
      error.value = err.message || 'Không thể tải phim trending'
      console.error('Error fetching trending:', err)
      trending.value = []
      return { items: [], pagination: {} }
    } finally {
      loading.value = false
    }
  }

  async function fetchTopRated(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getTopRated(page)
      
      if (response.status === 'success' && response.data) {
        topRated.value = Array.isArray(response.data.items) ? response.data.items : []
        return {
          items: topRated.value,
          pagination: response.data.params?.pagination || {}
        }
      }
      
      topRated.value = []
      return { items: [], pagination: {} }
    } catch (err) {
      error.value = err.message || 'Không thể tải phim top rated'
      console.error('Error fetching top rated:', err)
      topRated.value = []
      return { items: [], pagination: {} }
    } finally {
      loading.value = false
    }
  }

  async function fetchGenres() {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getGenres()
      
      if (response.status === 'success' && response.data) {
        genres.value = Array.isArray(response.data) ? response.data : []
        return genres.value
      }
      
      genres.value = []
      return []
    } catch (err) {
      error.value = err.message || 'Không thể tải thể loại'
      console.error('Error fetching genres:', err)
      genres.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchCountries() {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getCountries()
      
      if (response.status === 'success' && response.data) {
        countries.value = Array.isArray(response.data) ? response.data : []
        return countries.value
      }
      
      countries.value = []
      return []
    } catch (err) {
      error.value = err.message || 'Không thể tải danh sách quốc gia'
      console.error('Error fetching countries:', err)
      countries.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchYears() {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getYears()
      
      if (response.status === 'success' && response.data) {
        return Array.isArray(response.data) ? response.data : []
      }
      
      return []
    } catch (err) {
      error.value = err.message || 'Không thể tải danh sách năm'
      console.error('Error fetching years:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchMoviesByGenre(genreSlug, page = 1, params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getMoviesByGenre(genreSlug, { page, ...params })
      
      if (response.status === 'success' && response.data) {
        moviesByGenre.value[genreSlug] = response.data.items || []
        return {
          items: moviesByGenre.value[genreSlug],
          pagination: response.data.params?.pagination || {},
          titlePage: response.data.titlePage,
          breadCrumb: response.data.breadCrumb,
          seoOnPage: response.data.seoOnPage
        }
      }
      
      return { items: [], pagination: {} }
    } catch (err) {
      error.value = err.message || `Không thể tải phim thể loại ${genreSlug}`
      console.error('Error fetching movies by genre:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMoviesByCountry(countrySlug, page = 1, params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getMoviesByCountry(countrySlug, { page, ...params })
      
      if (response.status === 'success' && response.data) {
        return {
          items: response.data.items || [],
          pagination: response.data.params?.pagination || {},
          titlePage: response.data.titlePage,
          breadCrumb: response.data.breadCrumb,
          seoOnPage: response.data.seoOnPage
        }
      }
      
      return { items: [], pagination: {} }
    } catch (err) {
      error.value = err.message || `Không thể tải phim quốc gia ${countrySlug}`
      console.error('Error fetching movies by country:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMoviesByYear(year, page = 1, params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getMoviesByYear(year, { page, ...params })
      
      if (response.status === 'success' && response.data) {
        return {
          items: response.data.items || [],
          pagination: response.data.params?.pagination || {},
          titlePage: response.data.titlePage,
          breadCrumb: response.data.breadCrumb,
          seoOnPage: response.data.seoOnPage
        }
      }
      
      return { items: [], pagination: {} }
    } catch (err) {
      error.value = err.message || `Không thể tải phim năm ${year}`
      console.error('Error fetching movies by year:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMoviesByType(type, page = 1, params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getMoviesByType(type, page, params)
      
      if (response.status === 'success' && response.data) {
        return {
          items: response.data.items || [],
          pagination: response.data.params?.pagination || {},
          titlePage: response.data.titlePage,
          breadCrumb: response.data.breadCrumb,
          seoOnPage: response.data.seoOnPage
        }
      }
      
      return { items: [], pagination: {} }
    } catch (err) {
      error.value = err.message || `Không thể tải phim loại ${type}`
      console.error('Error fetching movies by type:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMovieDetail(slug) {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getMovieDetail(slug)
      
      if (response.status === 'success' && response.data) {
        currentMovie.value = response.data.item || response.data
        return currentMovie.value
      }
      
      return null
    } catch (err) {
      error.value = err.message || 'Không thể tải chi tiết phim'
      console.error('Error fetching movie detail:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchMovies(keyword, page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.search(keyword, page)
      
      if (response.status === 'success' && response.data) {
        searchResults.value = response.data.items || []
        return {
          items: searchResults.value,
          pagination: response.data.params?.pagination || {},
          titlePage: response.data.titlePage,
          breadCrumb: response.data.breadCrumb,
          seoOnPage: response.data.seoOnPage
        }
      }
      
      return { items: [], pagination: {} }
    } catch (err) {
      error.value = err.message || 'Không thể tìm kiếm phim'
      console.error('Error searching movies:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSimilarMovies(slug) {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getSimilarMovies(slug, 6)
      
      if (response.status === 'success' && response.data) {
        return response.data.items || []
      }
      
      return []
    } catch (err) {
      error.value = err.message || 'Không thể tải phim tương tự'
      console.error('Error fetching similar movies:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchContinueWatching() {
    loading.value = true
    error.value = null
    try {
      const response = await movieService.getContinueWatching()
      continueWatching.value = response.data || []
      return continueWatching.value
    } catch (err) {
      error.value = err.message || 'Không thể tải lịch sử xem'
      console.error('Error fetching continue watching:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearCurrentMovie() {
    currentMovie.value = null
  }

  function clearSearchResults() {
    searchResults.value = []
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    trending,
    topRated,
    genres,
    countries,
    moviesByGenre,
    currentMovie,
    continueWatching,
    searchResults,
    loading,
    error,
    cdnDomain,
    // Actions
    fetchTrending,
    fetchTopRated,
    fetchGenres,
    fetchCountries,
    fetchYears,
    fetchMoviesByGenre,
    fetchMoviesByCountry,
    fetchMoviesByYear,
    fetchMoviesByType,
    fetchMovieDetail,
    searchMovies,
    fetchSimilarMovies,
    fetchContinueWatching,
    clearCurrentMovie,
    clearSearchResults,
    clearError
  }
})
