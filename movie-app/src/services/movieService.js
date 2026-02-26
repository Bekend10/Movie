import api, { authApi } from './api'

/**
 * OPhim API Service
 * Documentation: https://ophim17.cc/api-document
 * Base URL: https://ophim1.com
 */

const movieService = {
  /**
   * Get homepage data
   * @param {number} page - Page number (default: 1)
   * @returns {Promise}
   */
  async getHome(page = 1) {
    const response = await api.get('/v1/api/home', {
      params: { page }
    })
    return response
  },

  /**
   * Get movies list with filters
   * @param {string} slug - List slug: 'phim-bo', 'phim-le', 'tv-shows', 'hoat-hinh', 
   *                        'phim-vietsub', 'phim-thuyet-minh', 'phim-long-tien', 
   *                        'phim-bo-dang-chieu', 'phim-bo-hoan-thanh', 'phim-sap-chieu', 
   *                        'subteam', 'phim-chieu-rap'
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 24)
   * @param {string} params.sort_field - Sort field: 'modified.time', 'year', '_id'
   * @param {string} params.sort_type - Sort type: 'desc', 'asc'
   * @param {string} params.category - Filter by categories (comma-separated slugs)
   * @param {string} params.country - Filter by countries (comma-separated slugs)
   * @param {string} params.year - Filter by year
   * @returns {Promise}
   */
  async getMoviesList(slug, params = {}) {
    const response = await api.get(`/v1/api/danh-sach/${slug}`, { params })
    return response
  },

  /**
   * Get trending movies (uses home endpoint)
   * @param {number} page - Page number
   * @param {Object} params - Additional parameters
   * @returns {Promise}
   */
  async getTrending(page = 1, params = {}) {
    return this.getHome(page)
  },

  /**
   * Get movies by type
   * @param {string} type - Movie type: 'phim-bo', 'phim-le', 'hoat-hinh', 'tv-shows'
   * @param {number} page - Page number
   * @param {Object} params - Additional parameters
   * @returns {Promise}
   */
  async getMoviesByType(type, page = 1, params = {}) {
    return this.getMoviesList(type, { page, ...params })
  },

  /**
   * Get top rated movies (sorted by rating)
   * @param {number} page - Page number
   * @returns {Promise}
   */
  async getTopRated(page = 1) {
    return this.getMoviesList('phim-le', {
      page,
      limit: 24,
      sort_field: 'year',
      sort_type: 'desc'
    })
  },

  /**
   * Search movies by keyword
   * @param {string} keyword - Search keyword
   * @param {number} page - Page number
   * @returns {Promise}
   */
  async search(keyword, page = 1) {
    const response = await api.get('/v1/api/tim-kiem', {
      params: { keyword, page }
    })
    return response
  },

  /**
   * Get all genres/categories
   * @returns {Promise}
   */
  async getGenres() {
    const response = await api.get('/v1/api/the-loai')
    return response
  },

  /**
   * Get movies by genre/category
   * @param {string} slug - Genre slug (e.g., 'hanh-dong', 'tinh-cam')
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 24)
   * @param {string} params.sort_field - Sort field: 'modified.time', 'year', '_id'
   * @param {string} params.sort_type - Sort type: 'desc', 'asc'
   * @param {string} params.country - Filter by countries (comma-separated slugs)
   * @param {string} params.year - Filter by year
   * @returns {Promise}
   */
  async getMoviesByGenre(slug, params = {}) {
    const response = await api.get(`/v1/api/the-loai/${slug}`, { params })
    return response
  },

  /**
   * Get all countries
   * @returns {Promise}
   */
  async getCountries() {
    const response = await api.get('/v1/api/quoc-gia')
    return response
  },

  /**
   * Get movies by country
   * @param {string} slug - Country slug (e.g., 'han-quoc', 'trung-quoc', 'my')
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 24)
   * @param {string} params.sort_field - Sort field: 'modified.time', 'year', '_id'
   * @param {string} params.sort_type - Sort type: 'desc', 'asc'
   * @param {string} params.year - Filter by year
   * @returns {Promise}
   */
  async getMoviesByCountry(slug, params = {}) {
    const response = await api.get(`/v1/api/quoc-gia/${slug}`, { params })
    return response
  },

  /**
   * Get all release years
   * @returns {Promise}
   */
  async getYears() {
    const response = await api.get('/v1/api/nam-phat-hanh')
    return response
  },

  /**
   * Get movies by release year
   * @param {number|string} year - Release year (e.g., 2024, 2023)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 24)
   * @param {string} params.sort_field - Sort field: 'modified.time', 'year', '_id'
   * @param {string} params.sort_type - Sort type: 'desc', 'asc'
   * @param {string} params.category - Filter by categories (comma-separated slugs)
   * @param {string} params.country - Filter by countries (comma-separated slugs)
   * @returns {Promise}
   */
  async getMoviesByYear(year, params = {}) {
    const response = await api.get(`/v1/api/nam-phat-hanh/${year}`, { params })
    return response
  },

  /**
   * Get movie detail by slug
   * @param {string} slug - Movie slug
   * @returns {Promise}
   */
  async getMovieDetail(slug) {
    const response = await api.get(`/v1/api/phim/${slug}`)
    return response
  },

  /**
   * Get movie images
   * @param {string} slug - Movie slug
   * @returns {Promise}
   */
  async getMovieImages(slug) {
    const response = await api.get(`/v1/api/phim/${slug}/images`)
    return response
  },

  /**
   * Get movie cast and crew
   * @param {string} slug - Movie slug
   * @returns {Promise}
   */
  async getMoviePeoples(slug) {
    const response = await api.get(`/v1/api/phim/${slug}/peoples`)
    return response
  },

  /**
   * Get movie keywords
   * @param {string} slug - Movie slug
   * @returns {Promise}
   */
  async getMovieKeywords(slug) {
    const response = await api.get(`/v1/api/phim/${slug}/keywords`)
    return response
  },

  /**
   * Get similar movies by genre matching
   * @param {string} slug - Movie slug
   * @param {number} limit - Number of movies to return
   * @returns {Promise}
   */
  async getSimilarMovies(slug, limit = 6) {
    try {
      // Get movie detail first to extract category
      const movieDetail = await this.getMovieDetail(slug)
      
      if (movieDetail.status === 'success' && movieDetail.data?.item?.category?.length > 0) {
        const firstCategory = movieDetail.data.item.category[0]
        const response = await this.getMoviesByGenre(firstCategory.slug, {
          page: 1,
          limit: limit + 1
        })
        
        if (response.status === 'success' && response.data?.items) {
          // Filter out current movie
          const items = response.data.items.filter(movie => movie.slug !== slug).slice(0, limit)
          return { status: 'success', data: { items } }
        }
      }
      
      return { status: 'success', data: { items: [] } }
    } catch (error) {
      console.error('Error getting similar movies:', error)
      return { status: 'success', data: { items: [] } }
    }
  },

  // User-related methods that will use authApi in the future
  
  /**
   * Get continue watching (requires auth API)
   * @returns {Promise}
   */
  async getContinueWatching() {
    // This would use authApi when backend is available
    // const response = await authApi.get('/user/continue-watching')
    // return response
    return { data: [] }
  },

  /**
   * Update watch progress (requires auth API)
   * @param {string} movieId - Movie ID
   * @param {Object} progress - Progress data
   * @returns {Promise}
   */
  async updateWatchProgress(movieId, progress) {
    // const response = await authApi.post(`/movies/${movieId}/progress`, { progress })
    // return response
    return { success: true }
  },

  /**
   * Get watchlist (requires auth API)
   * @returns {Promise}
   */
  async getWatchlist() {
    // const response = await authApi.get('/user/watchlist')
    // return response
    return { data: [] }
  },

  /**
   * Add to watchlist (requires auth API)
   * @param {string} movieId - Movie ID
   * @returns {Promise}
   */
  async addToWatchlist(movieId) {
    // const response = await authApi.post('/user/watchlist', { movieId })
    // return response
    return { success: true }
  },

  /**
   * Remove from watchlist (requires auth API)
   * @param {string} movieId - Movie ID
   * @returns {Promise}
   */
  async removeFromWatchlist(movieId) {
    // const response = await authApi.delete(`/user/watchlist/${movieId}`)
    // return response
    return { success: true }
  },

  /**
   * Get watch history (requires auth API)
   * @returns {Promise}
   */
  async getWatchHistory() {
    // const response = await authApi.get('/user/watch-history')
    // return response
    return { data: [] }
  },

  /**
   * Add review (requires auth API)
   * @param {string} movieId - Movie ID
   * @param {Object} review - Review data
   * @returns {Promise}
   */
  async addReview(movieId, review) {
    // const response = await authApi.post(`/movies/${movieId}/reviews`, review)
    // return response
    return { success: true }
  },

  /**
   * Get movie reviews (requires auth API)
   * @param {string} movieId - Movie ID
   * @returns {Promise}
   */
  async getMovieReviews(movieId) {
    // const response = await authApi.get(`/movies/${movieId}/reviews`)
    // return response
    return { data: [] }
  },

  /**
   * Get movie cast (alias for getMoviePeoples)
   * @param {string} slug - Movie slug
   * @returns {Promise}
   */
  async getMovieCast(slug) {
    return this.getMoviePeoples(slug)
  },

  /**
   * Get movie episodes (included in movie detail)
   * @param {string} slug - Movie slug
   * @returns {Promise}
   */
  async getMovieEpisodes(slug) {
    // Episodes are included in the movie detail response
    const response = await this.getMovieDetail(slug)
    return response
  }
}

export default movieService
