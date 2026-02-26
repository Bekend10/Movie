<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()

const usernameOrEmail = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = async () => {
  try {
    // Check if input is email or username
    const isEmail = usernameOrEmail.value.includes('@')
    const credentials = {
      password: password.value
    }
    
    if (isEmail) {
      credentials.email = usernameOrEmail.value
    } else {
      credentials.username = usernameOrEmail.value
    }
    
    await authStore.login(credentials)
    uiStore.showToast('Đăng nhập thành công!', 'success')
    router.push('/')
  } catch (error) {
    uiStore.showToast(error.message || 'Đăng nhập thất bại', 'error')
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-background"></div>

    <div class="login-container">
      <div class="login-card">
        <!-- Logo -->
        <div class="login-header">
          <h1 class="login-logo">NET<span>FLEX</span></h1>
          <p class="login-subtitle">Đăng nhập để tiếp tục</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email or Username -->
          <div class="form-group">
            <label for="usernameOrEmail">Email hoặc Tên đăng nhập</label>
            <div class="input-with-icon">
              <Mail :size="20" class="input-icon" />
              <input
                id="usernameOrEmail"
                v-model="usernameOrEmail"
                type="text"
                placeholder="admin hoặc email@example.com"
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password">Mật khẩu</label>
            <div class="input-with-icon">
              <Lock :size="20" class="input-icon" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <router-link to="/forgot-password" class="forgot-link">
              Quên mật khẩu?
            </router-link>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
            {{ authStore.loading ? 'Đang đăng nhập...' : 'Đăng Nhập' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="divider">
          <span>HOẶC</span>
        </div>

        <!-- Social Login -->
        <div class="social-login">
          <button class="social-btn google">
            <span>G</span> Google
          </button>
          <button class="social-btn facebook">
            <span>f</span> Facebook
          </button>
        </div>

        <!-- Sign Up Link -->
        <div class="signup-link">
          Chưa có tài khoản? 
          <router-link to="/register">Đăng ký ngay</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: var(--space-lg);
}

.login-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  z-index: -1;
}

.login-container {
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-lg);
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.login-logo {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 var(--space-sm);
}

.login-logo span {
  color: var(--accent-primary);
}

.login-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--accent-primary);
  opacity: 0.8;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: var(--text-muted);
}

.input-with-icon input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  background-color: #333;
  border: 1px solid #555;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: var(--transition-base);
}

.input-with-icon input:focus {
  border-color: var(--accent-primary);
  background-color: #3a3a3a;
}

.toggle-password {
  position: absolute;
  right: 16px;
  color: var(--text-muted);
  padding: 0;
}

.toggle-password:hover {
  color: var(--text-primary);
}

/* Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  color: var(--text-secondary);
}

.checkbox-label input {
  cursor: pointer;
}

.forgot-link {
  color: var(--accent-primary);
}

.forgot-link:hover {
  text-decoration: underline;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin: var(--space-lg) 0;
  color: var(--text-muted);
  font-size: var(--font-size-xs);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #555;
}

/* Social Login */
.social-login {
  display: flex;
  gap: var(--space-md);
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 12px;
  background-color: #333;
  border: 1px solid #555;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: var(--transition-base);
}

.social-btn:hover {
  background-color: #3a3a3a;
  border-color: #666;
}

.social-btn span {
  font-weight: 700;
  font-size: var(--font-size-lg);
}

/* Sign Up */
.signup-link {
  text-align: center;
  margin-top: var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.signup-link a {
  color: var(--accent-primary);
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 640px) {
  .login-card {
    padding: var(--space-xl);
  }

  .social-login {
    flex-direction: column;
  }
}
</style>
