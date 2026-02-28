<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings,
  ChevronRight,
  RotateCcw,
  RotateCw
} from 'lucide-vue-next'
import movieService from '../services/movieService'

const route = useRoute()
const router = useRouter()
const videoRef = ref(null)
const playerContainerRef = ref(null)
const loading = ref(true)
const error = ref(null)
const movie = ref(null)
const currentEpisode = ref(null)
const videoUrl = ref('')
const episodes = ref([])
const selectedServer = ref(0)
let hls = null

// Video Controls State
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const showControls = ref(true)
const playbackRate = ref(1)
const showSpeedMenu = ref(false)
const buffered = ref(0)
let controlsTimeout = null

// Playback speed options
const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]

// Computed
const progressPercent = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
})

const bufferedPercent = computed(() => {
  return duration.value > 0 ? (buffered.value / duration.value) * 100 : 0
})

const formattedTime = (time) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Get current episode index
const currentEpisodeIndex = computed(() => {
  if (!currentEpisode.value || !episodes.value[selectedServer.value]) return -1
  return episodes.value[selectedServer.value].server_data.findIndex(
    ep => ep.slug === currentEpisode.value.slug
  )
})

// Check if there's next/previous episode
const hasNextEpisode = computed(() => {
  if (!episodes.value[selectedServer.value]) return false
  return currentEpisodeIndex.value < episodes.value[selectedServer.value].server_data.length - 1
})

const hasPreviousEpisode = computed(() => {
  return currentEpisodeIndex.value > 0
})

// Total episodes count
const totalEpisodesCount = computed(() => {
  if (!episodes.value[selectedServer.value]) return 0
  return episodes.value[selectedServer.value].server_data.length
})

// Check if should show episode info (more than 2 episodes)
const shouldShowEpisodeInfo = computed(() => {
  return totalEpisodesCount.value > 2
})

// Video Control Functions
const togglePlay = () => {
  if (!videoRef.value) return
  
  if (videoRef.value.paused) {
    videoRef.value.play()
  } else {
    videoRef.value.pause()
  }
}

const skipBackward = () => {
  if (!videoRef.value) return
  videoRef.value.currentTime = Math.max(0, videoRef.value.currentTime - 10)
}

const skipForward = () => {
  if (!videoRef.value) return
  videoRef.value.currentTime = Math.min(
    videoRef.value.duration,
    videoRef.value.currentTime + 10
  )
}

const seek = (event) => {
  if (!videoRef.value) return
  
  const rect = event.currentTarget.getBoundingClientRect()
  const pos = (event.clientX - rect.left) / rect.width
  videoRef.value.currentTime = pos * videoRef.value.duration
}

const toggleMute = () => {
  if (!videoRef.value) return
  
  if (isMuted.value) {
    videoRef.value.volume = volume.value
    isMuted.value = false
  } else {
    videoRef.value.volume = 0
    isMuted.value = true
  }
}

const changeVolume = (event) => {
  if (!videoRef.value) return
  
  const newVolume = parseFloat(event.target.value)
  volume.value = newVolume
  videoRef.value.volume = newVolume
  isMuted.value = newVolume === 0
}

const changePlaybackRate = (rate) => {
  if (!videoRef.value) return
  
  playbackRate.value = rate
  videoRef.value.playbackRate = rate
  showSpeedMenu.value = false
}

const toggleFullscreen = () => {
  if (!playerContainerRef.value) return
  
  if (!document.fullscreenElement) {
    playerContainerRef.value.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const nextEpisode = () => {
  if (!hasNextEpisode.value) return
  
  const nextEp = episodes.value[selectedServer.value].server_data[currentEpisodeIndex.value + 1]
  selectEpisode(nextEp)
}

const previousEpisode = () => {
  if (!hasPreviousEpisode.value) return
  
  const prevEp = episodes.value[selectedServer.value].server_data[currentEpisodeIndex.value - 1]
  selectEpisode(prevEp)
}

// Auto-hide controls
const showControlsTemporarily = () => {
  showControls.value = true
  
  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
  }
  
  controlsTimeout = setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 10000)
}

const handleMouseMove = () => {
  showControlsTemporarily()
}

// Setup video event listeners
const setupVideoListeners = () => {
  if (!videoRef.value) return
  
  videoRef.value.addEventListener('play', () => {
    isPlaying.value = true
  })
  
  videoRef.value.addEventListener('pause', () => {
    isPlaying.value = false
    showControls.value = true
  })
  
  videoRef.value.addEventListener('timeupdate', () => {
    currentTime.value = videoRef.value.currentTime
  })
  
  videoRef.value.addEventListener('loadedmetadata', () => {
    duration.value = videoRef.value.duration
  })
  
  videoRef.value.addEventListener('volumechange', () => {
    volume.value = videoRef.value.volume
    isMuted.value = videoRef.value.muted
  })
  
  videoRef.value.addEventListener('progress', () => {
    if (videoRef.value.buffered.length > 0) {
      buffered.value = videoRef.value.buffered.end(videoRef.value.buffered.length - 1)
    }
  })
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyPress)
}

const handleKeyPress = (e) => {
  if (!videoRef.value) return
  
  switch (e.key) {
    case ' ':
    case 'k':
      e.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      e.preventDefault()
      skipBackward()
      break
    case 'ArrowRight':
      e.preventDefault()
      skipForward()
      break
    case 'ArrowUp':
      e.preventDefault()
      volume.value = Math.min(1, volume.value + 0.1)
      videoRef.value.volume = volume.value
      break
    case 'ArrowDown':
      e.preventDefault()
      volume.value = Math.max(0, volume.value - 0.1)
      videoRef.value.volume = volume.value
      break
    case 'm':
      e.preventDefault()
      toggleMute()
      break
    case 'f':
      e.preventDefault()
      toggleFullscreen()
      break
  }
}

const loadMovieData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const slug = route.params.slug
    const episodeSlug = route.params.episode
    
    console.log('Loading movie:', slug, 'episode:', episodeSlug)
    
    // Fetch movie detail to get episodes
    const response = await movieService.getMovieDetail(slug)
    
    if (response.status === 'success' && response.data?.item) {
      movie.value = response.data.item
      episodes.value = movie.value.episodes || []
      
      console.log('Episodes loaded:', episodes.value.length)
      
      // Find the episode to play
      if (episodes.value.length > 0) {
        const firstServer = episodes.value[0]
        
        if (episodeSlug) {
          // Find specific episode
          for (let i = 0; i < episodes.value.length; i++) {
            const server = episodes.value[i]
            const found = server.server_data?.find(ep => ep.slug === episodeSlug)
            if (found) {
              selectedServer.value = i
              currentEpisode.value = found
              videoUrl.value = found.link_m3u8 || found.link_embed
              console.log('Found episode:', found.name, 'URL:', videoUrl.value)
              break
            }
          }
        } else {
          // Play first episode
          if (firstServer.server_data?.length > 0) {
            currentEpisode.value = firstServer.server_data[0]
            videoUrl.value = currentEpisode.value.link_m3u8 || currentEpisode.value.link_embed
            console.log('Auto-selected first episode:', currentEpisode.value.name, 'URL:', videoUrl.value)
          }
        }
      }
      
      if (!videoUrl.value) {
        throw new Error('Không tìm thấy link phát video')
      }
      
      console.log('Video URL ready:', videoUrl.value)
      
    } else {
      throw new Error('Không tìm thấy phim')
    }
  } catch (err) {
    console.error('Error loading movie:', err)
    error.value = err.message || 'Có lỗi xảy ra khi tải video'
  } finally {
    loading.value = false
    
    // Wait for DOM to update before loading video
    if (!error.value && videoUrl.value) {
      await nextTick()
      console.log('DOM updated, loading video now')
      await loadVideo()
    }
  }
}

const loadVideo = async () => {
  console.log('loadVideo called. videoRef:', !!videoRef.value, 'videoUrl:', videoUrl.value)
  
  if (!videoRef.value) {
    console.error('Video element not found')
    error.value = 'Không tìm thấy video player'
    return
  }
  
  if (!videoUrl.value) {
    console.error('Video URL is empty')
    error.value = 'Không có URL video'
    return
  }
  
  // Destroy previous HLS instance if exists
  if (hls) {
    console.log('Destroying previous HLS instance')
    hls.destroy()
    hls = null
  }
  
  // Check if it's an m3u8 file
  if (videoUrl.value.includes('.m3u8')) {
    console.log('Detected m3u8 file, using HLS.js')
    
    // Use HLS.js for m3u8 playback
    if (typeof window.Hls !== 'undefined') {
      console.log('HLS.js is available, isSupported:', window.Hls.isSupported())
      
      if (window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          debug: true
        })
        
        console.log('Loading source:', videoUrl.value)
        hls.loadSource(videoUrl.value)
        hls.attachMedia(videoRef.value)
        
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          console.log('Manifest parsed, starting playback')
          setupVideoListeners()
          videoRef.value.play().catch(err => {
            console.error('Play error:', err)
          })
        })
        
        hls.on(window.Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', event, data)
          if (data.fatal) {
            switch (data.type) {
              case window.Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Network error, trying to recover')
                hls.startLoad()
                break
              case window.Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Media error, trying to recover')
                hls.recoverMediaError()
                break
              default:
                console.error('Fatal error, cannot recover')
                error.value = 'Lỗi phát video: ' + data.details
                break
            }
          }
        })
      } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        console.log('Using native HLS support')
        setupVideoListeners()
        videoRef.value.src = videoUrl.value
        videoRef.value.addEventListener('loadedmetadata', () => {
          videoRef.value.play().catch(err => {
            console.error('Play error:', err)
          })
        })
      } else {
        console.error('HLS not supported')
        error.value = 'Trình duyệt không hỗ trợ phát video này'
      }
    } else {
      console.warn('HLS.js not loaded, trying native playback')
      // Fallback: try native playback
      setupVideoListeners()
      videoRef.value.src = videoUrl.value
      videoRef.value.play().catch(err => {
        console.error('Play error:', err)
        error.value = 'Không thể phát video'
      })
    }
  } else {
    // Regular video file
    console.log('Regular video file, using native player')
    setupVideoListeners()
    videoRef.value.src = videoUrl.value
    videoRef.value.play().catch(err => {
      console.error('Play error:', err)
      error.value = 'Không thể phát video'
    })
  }
}

const selectEpisode = (episode) => {
  router.push(`/watch/${route.params.slug}/${episode.slug}`)
}

const goBack = () => {
  router.push(`/movie/${route.params.slug}`)
}

// Watch for route changes
watch(() => route.params.episode, () => {
  if (route.name === 'Watch') {
    console.log('Route changed, reloading movie data')
    loadMovieData()
  }
})

onMounted(async () => {
  console.log('PlayerPage mounted')
  
  // Load HLS.js from CDN
  if (typeof window.Hls === 'undefined') {
    console.log('Loading HLS.js from CDN')
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest'
    script.onload = () => {
      console.log('HLS.js loaded successfully')
      loadMovieData()
    }
    script.onerror = (err) => {
      console.error('Failed to load HLS.js:', err)
      error.value = 'Không thể tải thư viện phát video'
      loading.value = false
    }
    document.head.appendChild(script)
  } else {
    console.log('HLS.js already loaded')
    await loadMovieData()
  }
})

onBeforeUnmount(() => {
  if (hls) {
    hls.destroy()
  }
  
  document.removeEventListener('keydown', handleKeyPress)
  
  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
  }
})
</script>

<template>
  <div class="player-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải video...</p>
    </div>
    
    <!-- Error -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="goBack" class="btn-back">Quay lại</button>
    </div>
    
    <!-- Player -->
    <div v-else class="player-container">
      <!-- Header -->
      <div class="player-header">
        <button @click="goBack" class="btn-back-icon">
          <ChevronLeft :size="24" />
          Quay lại
        </button>
        <div class="player-info">
          <h1>{{ movie?.name }}</h1>
          <p v-if="currentEpisode">Tập {{ currentEpisode.name }}</p>
        </div>
      </div>
      
      <!-- Video Player -->
      <div 
        ref="playerContainerRef" 
        class="video-wrapper"
        @mousemove="handleMouseMove"
        @mouseleave="isPlaying && (showControls = false)"
      >
        <video
          ref="videoRef"
          class="video-player"
          @click="togglePlay"
          crossorigin="anonymous"
        >
          Trình duyệt của bạn không hỗ trợ phát video.
        </video>
        
        <!-- Movie Info Overlay (Top) -->
        <Transition name="fade">
          <div v-show="showControls || !isPlaying" class="movie-info-overlay">
            <div class="movie-info-content">
              <h2 class="movie-title">{{ movie?.name }}</h2>
              <p v-if="currentEpisode && shouldShowEpisodeInfo" class="episode-info">
                Tập {{ currentEpisode.name }} / {{ totalEpisodesCount }}
              </p>
            </div>
          </div>
        </Transition>

        <!-- Custom Controls Overlay -->
        <Transition name="fade">
          <div v-show="showControls || !isPlaying" class="video-controls-overlay">
            <!-- Center Play Button -->
            <div class="center-controls">
              <!-- Skip Backward 10s -->
              <button 
                @click="skipBackward" 
                class="btn-skip-center" 
                title="Tua lùi 10s (←)"
              >
                <RotateCcw :size="40" />
              </button>
              
              <!-- Play/Pause -->
              <button @click="togglePlay" class="btn-play-large">
                <Play v-if="!isPlaying" :size="60" />
                <Pause v-else :size="60" />
              </button>
              
              <!-- Skip Forward 10s -->
              <button 
                @click="skipForward" 
                class="btn-skip-center" 
                title="Tua tới 10s (→)"
              >
                <RotateCw :size="40" />
              </button>
            </div>
            
            <!-- Bottom Controls Bar -->
            <div class="controls-bar">
              <!-- Progress Bar -->
              <div class="progress-container" @click="seek">
                <div class="progress-buffered" :style="{ width: bufferedPercent + '%' }"></div>
                <div class="progress-bar" :style="{ width: progressPercent + '%' }">
                  <div class="progress-handle"></div>
                </div>
              </div>
              
              <!-- Control Buttons -->
              <div class="controls-bottom">
                <div class="controls-left">
                  <!-- Previous Episode -->
                  <button 
                    v-if="hasPreviousEpisode" 
                    @click="previousEpisode" 
                    class="control-btn"
                    title="Tập trước"
                  >
                    <SkipBack :size="24" />
                  </button>
                  
                  <!-- Play/Pause -->
                  <button @click="togglePlay" class="control-btn btn-play-main" title="Play/Pause (Space)">
                    <Play v-if="!isPlaying" :size="28" />
                    <Pause v-else :size="28" />
                  </button>
                  
                  <!-- Next Episode -->
                  <button 
                    v-if="hasNextEpisode" 
                    @click="nextEpisode" 
                    class="control-btn"
                    title="Tập sau"
                  >
                    <SkipForward :size="24" />
                  </button>
                  
                  <div class="volume-control">
                    <button @click="toggleMute" class="control-btn" title="Tắt/Bật tiếng (M)">
                      <Volume2 v-if="!isMuted && volume > 0" :size="24" />
                      <VolumeX v-else :size="24" />
                    </button>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      :value="volume"
                      @input="changeVolume"
                      class="volume-slider"
                    />
                  </div>
                  
                  <div class="time-display">
                    {{ formattedTime(currentTime) }} / {{ formattedTime(duration) }}
                  </div>
                </div>
                
                <div class="controls-right">
                  <!-- Playback Speed -->
                  <div class="speed-control">
                    <button 
                      @click="showSpeedMenu = !showSpeedMenu" 
                      class="control-btn"
                      title="Tốc độ phát"
                    >
                      <Settings :size="24" />
                      <span class="speed-text">{{ playbackRate }}x</span>
                    </button>
                    
                    <Transition name="slide-up">
                      <div v-if="showSpeedMenu" class="speed-menu">
                        <button
                          v-for="speed in speedOptions"
                          :key="speed"
                          @click="changePlaybackRate(speed)"
                          :class="['speed-option', { active: playbackRate === speed }]"
                        >
                          {{ speed }}x
                        </button>
                      </div>
                    </Transition>
                  </div>
                  
                  <button @click="toggleFullscreen" class="control-btn" title="Toàn màn hình (F)">
                    <Maximize :size="24" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      
      <!-- Episodes List -->
      <div v-if="episodes.length > 0" class="episodes-sidebar">
        <h3>Danh sách tập</h3>
        
        <!-- Server Selector -->
        <div v-if="episodes.length > 1" class="server-selector">
          <select v-model="selectedServer" class="server-select">
            <option v-for="(server, index) in episodes" :key="index" :value="index">
              {{ server.server_name }}
            </option>
          </select>
        </div>
        
        <!-- Episodes List -->
        <div class="episodes-list">
          <button
            v-for="ep in episodes[selectedServer]?.server_data || []"
            :key="ep.slug"
            @click="selectEpisode(ep)"
            :class="['episode-item', { active: currentEpisode?.slug === ep.slug }]"
          >
            <span class="episode-number">{{ ep.name }}</span>
            <span class="episode-title">{{ ep.filename }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-page {
  width: 100vw;
  min-height: 100vh;
  background-color: #000;
  color: var(--text-primary);
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: var(--space-lg);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: #ff4444;
  font-size: 1.1rem;
}

.btn-back {
  padding: var(--space-md) var(--space-xl);
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
}

.btn-back:hover {
  background: var(--primary-dark);
}

.player-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  grid-template-rows: auto 1fr;
  height: 100vh;
  gap: 0;
}

.player-header {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-md) var(--space-lg);
  background: rgba(0, 0, 0, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-back-icon {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-back-icon:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary);
}

.player-info h1 {
  font-size: 1.25rem;
  margin: 0;
  color: var(--text-primary);
}

.player-info p {
  font-size: 0.9rem;
  margin: 0;
  color: var(--text-secondary);
}

.video-wrapper {
  grid-column: 1;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative;
  cursor: pointer;
}

.video-player {
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 60px);
  object-fit: contain;
}

/* Movie Info Overlay */
.movie-info-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: var(--space-xl) var(--space-xl);
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    transparent 100%
  );
  z-index: 11;
  pointer-events: none;
}

.movie-info-content {
  text-align: left;
}

.movie-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  line-height: 1.3;
}

.episode-info {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
}

/* Custom Video Controls */
.video-controls-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    transparent 20%,
    transparent 80%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 10;
}

.center-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl);
  flex: 1;
}

.btn-skip-center {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  position: relative;
}

.btn-skip-center:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: var(--primary);
  transform: scale(1.1);
}

.skip-text-center {
  position: absolute;
  font-size: 12px;
  font-weight: 700;
  bottom: 12px;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 6px;
  border-radius: 4px;
}

.btn-play-large {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.btn-play-large:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: var(--primary);
  transform: scale(1.1);
}

.controls-bar {
  padding: 0 var(--space-lg) var(--space-md);
}

/* Progress Bar */
.progress-container {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  margin-bottom: var(--space-md);
  transition: height 0.2s;
}

.progress-container:hover {
  height: 8px;
}

.progress-buffered {
  position: absolute;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  pointer-events: none;
}

.progress-bar {
  position: absolute;
  height: 100%;
  background: var(--primary, #e50914);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
}

.progress-handle {
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-container:hover .progress-handle {
  opacity: 1;
}

/* Control Buttons */
.controls-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: var(--space-sm);
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  position: relative;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.btn-play-main {
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.15);
}

.btn-play-main:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Volume Control */
.volume-control {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.volume-slider {
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.time-display {
  font-size: 0.9rem;
  color: white;
  font-weight: 500;
  white-space: nowrap;
  min-width: 100px;
}

/* Speed Control */
.speed-control {
  position: relative;
}

.speed-text {
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 32px;
  text-align: center;
}

.speed-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 80px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.speed-option {
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: all 0.2s;
}

.speed-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.speed-option.active {
  background: var(--primary);
  font-weight: 600;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.episodes-sidebar {
  grid-column: 2;
  grid-row: 2;
  background: rgba(20, 20, 20, 0.95);
  padding: var(--space-lg);
  overflow-y: auto;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.episodes-sidebar h3 {
  font-size: 1.1rem;
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
}

.server-selector {
  margin-bottom: var(--space-lg);
}

.server-select {
  width: 100%;
  padding: var(--space-md);
  background: rgba(40, 40, 40, 0.8);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  cursor: pointer;
}

.server-select:focus {
  outline: none;
  border-color: var(--primary);
}

.episodes-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.episode-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: rgba(40, 40, 40, 0.5);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.episode-item:hover {
  background: rgba(60, 60, 60, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

.episode-item.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.episode-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.9rem;
}

.episode-item.active .episode-number {
  background: rgba(255, 255, 255, 0.2);
}

.episode-title {
  flex: 1;
  font-size: 0.85rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Responsive */
@media (max-width: 1024px) {
  .player-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
  
  .episodes-sidebar {
    grid-column: 1;
    grid-row: 3;
    max-height: 300px;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .volume-slider {
    width: 60px;
  }
  
  .time-display {
    font-size: 0.8rem;
    min-width: 80px;
  }
}

@media (max-width: 640px) {
  .player-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
  
  .player-info h1 {
    font-size: 1rem;
  }
  
  .movie-info-overlay {
    padding: var(--space-lg) var(--space-md);
  }
  
  .movie-title {
    font-size: 1.25rem;
  }
  
  .episode-info {
    font-size: 0.95rem;
  }
  
  .controls-bar {
    padding: 0 var(--space-md) var(--space-sm);
  }
  
  .center-controls {
    gap: var(--space-lg);
  }
  
  .controls-bottom {
    flex-wrap: wrap;
    gap: var(--space-sm);
  }
  
  .controls-left,
  .controls-right {
    gap: var(--space-xs);
  }
  
  .control-btn {
    padding: var(--space-xs);
  }
  
  .btn-play-large {
    width: 60px;
    height: 60px;
  }
  
  .btn-play-large svg {
    width: 40px;
    height: 40px;
  }
  
  .btn-skip-center {
    width: 50px;
    height: 50px;
  }
  
  .btn-skip-center svg {
    width: 28px;
    height: 28px;
  }
  
  .skip-text-center {
    font-size: 10px;
    bottom: 8px;
    padding: 1px 4px;
  }
  
  .volume-control {
    display: none;
  }
  
  .time-display {
    font-size: 0.75rem;
    min-width: auto;
  }
  
  .speed-text {
    font-size: 0.75rem;
    min-width: 24px;
  }
}
</style>
