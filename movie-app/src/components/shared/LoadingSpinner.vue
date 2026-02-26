<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium' // small, medium, large
  }
})
</script>

<template>
  <div class="loading-spinner" :class="`spinner-${size}`">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.spinner {
  border: 3px solid var(--bg-elevated);
  border-top-color: var(--accent-primary);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

.spinner-small .spinner {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.spinner-medium .spinner {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.spinner-large .spinner {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
