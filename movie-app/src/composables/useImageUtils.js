/**
 * Image utilities for OPhim API
 * CDN Base URL: https://img.ophim.cc/uploads/movies/
 * TMDB Base URL: https://image.tmdb.org/t/p/
 */

const OPHIM_CDN_BASE = 'https://img.ophim.cc/uploads/movies/'
const TMDB_BASE_URL = 'https://image.tmdb.org/t/p/'

/**
 * Get full image URL from OPhim API response
 * @param {string} path - Relative or absolute image path
 * @returns {string} Full image URL
 */
export const getImageUrl = (path) => {
  if (!path) return '/placeholder.jpg'
  
  // If path is already absolute URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // If path starts with /, remove it
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Prepend CDN base URL
  return `${OPHIM_CDN_BASE}${cleanPath}`
}

/**
 * Get poster image URL
 * @param {Object} movie - Movie object from API
 * @param {string} cdnDomain - Optional CDN domain (e.g., 'https://img.ophim.live')
 * @returns {string} Poster URL
 */
export const getPosterUrl = (movie, cdnDomain = null) => {
  if (!movie) return '/placeholder.jpg'
  
  const imagePath = movie.poster_url || movie.thumb_url || ''
  
  // If cdnDomain is provided, use getOPhimImageUrl
  if (cdnDomain && imagePath) {
    return getOPhimImageUrl(imagePath, cdnDomain)
  }
  
  // Otherwise use default getImageUrl
  return getImageUrl(imagePath)
}

/**
 * Get thumb image URL
 * @param {Object} movie - Movie object from API
 * @param {string} cdnDomain - Optional CDN domain
 * @returns {string} Thumb URL
 */
export const getThumbUrl = (movie, cdnDomain = null) => {
  if (!movie) return '/placeholder.jpg'
  
  const imagePath = movie.thumb_url || movie.poster_url || ''
  
  // If cdnDomain is provided, use getOPhimImageUrl
  if (cdnDomain && imagePath) {
    return getOPhimImageUrl(imagePath, cdnDomain)
  }
  
  // Otherwise use default getImageUrl
  return getImageUrl(imagePath)
}

/**
 * Process TMDB images from OPhim images API response
 * @param {Object} imagesData - Response data from getMovieImages API
 * @param {Object} options - Options: { type: 'backdrop'|'poster', limit: number, size: string }
 * @returns {Array<string>} Array of full image URLs
 */
export const processTMDBImages = (imagesData, options = {}) => {
  if (!imagesData?.images || !Array.isArray(imagesData.images)) {
    return []
  }

  const {
    type = 'backdrop',  // 'backdrop' or 'poster'
    limit = 12,
    size = 'original'   // 'original', 'w1280', 'w780', etc.
  } = options

  // Get base URL from image_sizes
  let baseUrl = imagesData.image_sizes?.[type]?.[size]
  
  // Check if baseUrl is a full URL or just the size name
  if (baseUrl && !baseUrl.startsWith('http')) {
    // If it's just the size name, construct full URL
    baseUrl = `${TMDB_BASE_URL}${baseUrl}`
  } else if (!baseUrl) {
    // If no base URL found, construct from TMDB_BASE_URL + size
    baseUrl = `${TMDB_BASE_URL}${size}`
  }

  // Filter by type, limit, and map to full URLs
  return imagesData.images
    .filter(img => img.type === type)
    .slice(0, limit)
    .map(img => `${baseUrl}${img.file_path}`)
}

/**
 * Get TMDB image URL
 * @param {string} filePath - TMDB file path (e.g., "/abc123.jpg")
 * @param {string} size - Image size (e.g., 'original', 'w500', 'w1280')
 * @param {string} type - Image type ('backdrop' or 'poster')
 * @returns {string} Full TMDB image URL
 */
export const getTMDBImageUrl = (filePath, size = 'original', type = 'backdrop') => {
  if (!filePath) return '/placeholder.jpg'
  return `${TMDB_BASE_URL}${size}${filePath}`
}

/**
 * Get OPhim image URL with custom CDN domain
 * @param {string} path - Relative image path (e.g., "movie-thumb.jpg")
 * @param {string} cdnDomain - CDN domain (e.g., "https://img.ophim.live")
 * @returns {string} Full image URL
 */
export const getOPhimImageUrl = (path, cdnDomain = OPHIM_CDN_BASE) => {
  if (!path) return '/placeholder.jpg'
  
  // If path is already absolute URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // If cdnDomain doesn't end with /, add it
  const baseDomain = cdnDomain.endsWith('/') ? cdnDomain : `${cdnDomain}/`
  
  // Construct full URL
  // If path contains 'uploads/movies/', use it as is
  if (cleanPath.includes('uploads/movies/')) {
    return `${baseDomain}${cleanPath}`
  }
  
  // Otherwise, prepend uploads/movies/
  return `${baseDomain}uploads/movies/${cleanPath}`
}

/**
 * Composable for image utilities
 */
export const useImageUtils = () => {
  return {
    getImageUrl,
    getPosterUrl,
    getThumbUrl,
    processTMDBImages,
    getTMDBImageUrl,
    getOPhimImageUrl,
    OPHIM_CDN_BASE,
    TMDB_BASE_URL
  }
}

export default useImageUtils
