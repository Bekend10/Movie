<script setup>
import { computed } from 'vue'
import { X, Info, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-vue-next'
import { useUIStore } from '../../stores/uiStore'

const uiStore = useUIStore()

const icon = computed(() => {
  switch (uiStore.toast.type) {
    case 'success':
      return CheckCircle
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    default:
      return Info
  }
})

const iconColor = computed(() => {
  switch (uiStore.toast.type) {
    case 'success':
      return 'var(--accent-green)'
    case 'error':
      return 'var(--accent-primary)'
    case 'warning':
      return 'var(--accent-gold)'
    default:
      return 'var(--text-secondary)'
  }
})
</script>

<template>
  <Transition name="slide-in-right">
    <div v-if="uiStore.toast.show" class="toast-notification" :class="`toast-${uiStore.toast.type}`">
      <div class="toast-content">
        <component :is="icon" :size="20" :color="iconColor" />
        <p class="toast-message">{{ uiStore.toast.message }}</p>
        <button class="toast-close" @click="uiStore.hideToast">
          <X :size="18" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-notification {
  position: fixed;
  top: 90px;
  right: var(--space-lg);
  z-index: var(--z-toast);
  min-width: 320px;
  max-width: 480px;
  padding: var(--space-md) var(--space-lg);
  background-color: var(--bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.toast-message {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  margin: 0;
  line-height: 1.5;
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: var(--transition-base);
}

.toast-close:hover {
  background-color: var(--bg-card);
  color: var(--text-primary);
}

/* Toast variants */
.toast-success {
  border-left: 4px solid var(--accent-green);
}

.toast-error {
  border-left: 4px solid var(--accent-primary);
}

.toast-warning {
  border-left: 4px solid var(--accent-gold);
}

.toast-info {
  border-left: 4px solid var(--text-secondary);
}

/* Animation */
.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: all 0.3s ease;
}

.slide-in-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-in-right-leave-to {
  transform: translateX(50%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .toast-notification {
    right: var(--space-md);
    left: var(--space-md);
    min-width: auto;
  }
}
</style>
