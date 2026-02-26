<script setup>
import { useRouter } from 'vue-router'
import { Home } from 'lucide-vue-next'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Không Tìm Thấy Trang</h2>
      <p class="error-message">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <button class="btn btn-primary" @click="goHome">
        <Home :size="20" />
        Về Trang Chủ
      </button>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  text-align: center;
  padding: var(--space-lg);
}

.not-found-content {
  max-width: 600px;
}

.error-code {
  font-size: 10rem;
  font-weight: 800;
  color: var(--accent-primary);
  margin: 0;
  line-height: 1;
  text-shadow: 0 0 40px rgba(229, 9, 20, 0.5);
}

.error-title {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin: var(--space-lg) 0 var(--space-md);
}

.error-message {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .error-code {
    font-size: 6rem;
  }

  .error-title {
    font-size: var(--font-size-xl);
  }

  .error-message {
    font-size: var(--font-size-base);
  }
}
</style>
