<script setup>
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from 'lucide-vue-next'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  movies: {
    type: Array,
    default: () => []
  },
  viewAll: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view-all'])

const scrollContainer = ref(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(true)

const scroll = (direction) => {
  if (!scrollContainer.value) return
  
  const container = scrollContainer.value
  const scrollAmount = container.offsetWidth * 0.8
  
  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
  
  // Update arrow visibility after scroll
  setTimeout(updateArrows, 300)
}

const updateArrows = () => {
  if (!scrollContainer.value) return
  
  const container = scrollContainer.value
  showLeftArrow.value = container.scrollLeft > 0
  showRightArrow.value = 
    container.scrollLeft < container.scrollWidth - container.offsetWidth - 10
}

const onScroll = () => {
  updateArrows()
}

const handleViewAll = () => {
  emit('view-all')
}
</script>

<template>
  <section class="movie-carousel">
    <div class="container">
      <!-- Title -->
      <div class="carousel-header">
        <h2 class="carousel-title">{{ title }}</h2>
        <div class="carousel-actions">
          <div class="carousel-controls">
            <button 
              class="carousel-arrow left" 
              @click="scroll('left')"
              v-show="showLeftArrow"
              aria-label="Previous"
            >
              <ChevronLeft :size="24" />
            </button>
            <button 
              class="carousel-arrow right" 
              @click="scroll('right')"
              v-show="showRightArrow"
              aria-label="Next"
            >
              <ChevronRight :size="24" />
            </button>
          </div>
        </div>
      </div>

      <!-- Movies Container -->
      <div 
        ref="scrollContainer" 
        class="movies-container"
        @scroll="onScroll"
      >
        <MovieCard 
          v-for="movie in movies" 
          :key="movie.id"
          :movie="movie"
        />
      </div>

      <!-- View All Button (below movies) -->
      <div v-if="viewAll" class="view-all-container">
        <button 
          @click="handleViewAll"
          class="view-all-btn"
        >
          Xem tất cả
          <ArrowRight :size="16" />
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="movies.length === 0" class="empty-state">
        <p>Không có phim nào</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.movie-carousel {
  padding: var(--space-lg) 0;
  position: relative;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.carousel-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.carousel-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

/* View All Container (below movies) */
.view-all-container {
  display: flex;
  justify-content: center;
  margin-top: var(--space-lg);
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md) var(--space-2xl);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.view-all-btn:hover {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
}

.carousel-controls {
  display: flex;
  gap: var(--space-sm);
}

.carousel-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--text-primary);
  transition: var(--transition-base);
  z-index: 10;
}

.carousel-arrow:hover {
  background-color: var(--accent-primary);
  transform: scale(1.1);
}

/* Movies Container */
.movies-container {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: var(--space-xs) 0;
}

.movies-container::-webkit-scrollbar {
  display: none;
}

/* Empty State */
.empty-state {
  padding: var(--space-2xl);
  text-align: center;
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 768px) {
  .carousel-title {
    font-size: var(--font-size-lg);
  }

  .view-all-btn {
    padding: var(--space-sm) var(--space-xl);
    font-size: var(--font-size-sm);
  }

  .carousel-controls {
    display: none;
  }

  .movies-container {
    gap: var(--space-sm);
  }
}
</style>
