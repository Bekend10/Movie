<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()

// Fetch user profile on app mount if token exists
onMounted(async () => {
  if (authStore.isLoggedIn) {
    try {
      await authStore.fetchProfile()
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }
})
</script>

<template>
  <div id="app" class="app-container">
    <!-- Router View -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  width: 100%;
  background-color: var(--bg-primary);
}
</style>
