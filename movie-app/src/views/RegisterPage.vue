<script setup>
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ToastNotification from '../components/shared/ToastNotification.vue'
</script>

<template>
  <div class="register-page">
    <AppHeader />
    <ToastNotification />
    
    <main class="register-content">
      <div class="container">
        <h1>Register</h1>
        <p class="text-muted">This page is under construction...</p>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.register-content {
  min-height: 100vh;
  padding-top: 100px;
}
</style>
