<script setup>
import { ref, computed } from 'vue'
import { User, Mail, Phone, MapPin, Calendar, Award, Clock, Heart, Edit, Settings, LogOut } from 'lucide-vue-next'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ToastNotification from '../components/shared/ToastNotification.vue'
import { mockUser } from '../data/mockData'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Use mock data for now
const userData = ref(mockUser)

const memberDuration = computed(() => {
  const memberSince = new Date(userData.value.stats.memberSince)
  const now = new Date()
  const years = now.getFullYear() - memberSince.getFullYear()
  const months = now.getMonth() - memberSince.getMonth()
  
  if (years > 0) {
    return `${years} năm ${months} tháng`
  }
  return `${months} tháng`
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="profile-page">
    <AppHeader />
    <ToastNotification />
    
    <main class="profile-content">
      <div class="container">
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="profile-banner"></div>
          <div class="profile-info">
            <div class="avatar-section">
              <img :src="userData.avatar" :alt="userData.fullName" class="profile-avatar" />
              <div class="subscription-badge" :class="userData.subscription.status">
                <Award :size="16" />
                {{ userData.subscription.plan }}
              </div>
            </div>
            <div class="user-details">
              <h1 class="user-name">{{ userData.fullName }}</h1>
              <p class="user-username">@{{ userData.username }}</p>
              <div class="user-stats">
                <div class="stat-item">
                  <Clock :size="18" />
                  <span>{{ userData.stats.totalWatched }} phim đã xem</span>
                </div>
                <div class="stat-item">
                  <Heart :size="18" />
                  <span>{{ userData.stats.favoriteMovies }} yêu thích</span>
                </div>
                <div class="stat-item">
                  <Calendar :size="18" />
                  <span>Thành viên {{ memberDuration }}</span>
                </div>
              </div>
            </div>
            <div class="profile-actions">
              <button class="btn-action btn-edit">
                <Edit :size="20" />
                Chỉnh sửa
              </button>
              <button class="btn-action btn-settings">
                <Settings :size="20" />
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="profile-grid">
          <!-- Personal Info -->
          <div class="info-card">
            <h2 class="card-title">
              <User :size="24" />
              Thông tin cá nhân
            </h2>
            <div class="info-list">
              <div class="info-item">
                <Mail :size="18" />
                <div class="info-content">
                  <label>Email</label>
                  <p>{{ userData.email }}</p>
                </div>
              </div>
              <div class="info-item">
                <Phone :size="18" />
                <div class="info-content">
                  <label>Số điện thoại</label>
                  <p>{{ userData.phone }}</p>
                </div>
              </div>
              <div class="info-item">
                <Calendar :size="18" />
                <div class="info-content">
                  <label>Ngày sinh</label>
                  <p>{{ new Date(userData.dateOfBirth).toLocaleDateString('vi-VN') }}</p>
                </div>
              </div>
              <div class="info-item">
                <MapPin :size="18" />
                <div class="info-content">
                  <label>Địa chỉ</label>
                  <p>{{ userData.address.street }}, {{ userData.address.district }}</p>
                  <p>{{ userData.address.city }}, {{ userData.address.country }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Subscription Info -->
          <div class="info-card">
            <h2 class="card-title">
              <Award :size="24" />
              Gói đăng ký
            </h2>
            <div class="subscription-details">
              <div class="sub-plan">
                <div class="plan-name">{{ userData.subscription.plan }}</div>
                <div class="plan-status" :class="userData.subscription.status">
                  {{ userData.subscription.status === 'active' ? 'Đang hoạt động' : 'Hết hạn' }}
                </div>
              </div>
              <div class="sub-pricing">
                <span class="price">{{ userData.subscription.price }}</span>
              </div>
              <div class="sub-dates">
                <div class="date-item">
                  <label>Ngày bắt đầu:</label>
                  <span>{{ new Date(userData.subscription.startDate).toLocaleDateString('vi-VN') }}</span>
                </div>
                <div class="date-item">
                  <label>Ngày hết hạn:</label>
                  <span>{{ new Date(userData.subscription.endDate).toLocaleDateString('vi-VN') }}</span>
                </div>
              </div>
              <button class="btn-renew">Gia hạn gói</button>
            </div>
          </div>

          <!-- Stats -->
          <div class="info-card">
            <h2 class="card-title">
              <Clock :size="24" />
              Thống kê
            </h2>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-value">{{ userData.stats.totalWatched }}</div>
                <div class="stat-label">Phim đã xem</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">{{ userData.stats.totalHours }}h</div>
                <div class="stat-label">Tổng thời gian</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">{{ userData.stats.favoriteMovies }}</div>
                <div class="stat-label">Yêu thích</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">{{ userData.stats.reviewsWritten }}</div>
                <div class="stat-label">Đánh giá</div>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="info-card">
            <h2 class="card-title">
              <Settings :size="24" />
              Tùy chọn
            </h2>
            <div class="info-list">
              <div class="info-item">
                <div class="info-content full-width">
                  <label>Chất lượng mặc định</label>
                  <p>{{ userData.preferences.quality }}</p>
                </div>
              </div>
              <div class="info-item">
                <div class="info-content full-width">
                  <label>Ngôn ngữ</label>
                  <p>{{ userData.preferences.language === 'vi' ? 'Tiếng Việt' : 'English' }}</p>
                </div>
              </div>
              <div class="info-item">
                <div class="info-content full-width">
                  <label>Thể loại yêu thích</label>
                  <div class="genre-tags">
                    <span v-for="genre in userData.preferences.favoriteGenres" :key="genre" class="genre-tag">
                      {{ genre }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-content full-width">
                  <label>Tự động phát</label>
                  <p>{{ userData.preferences.autoplay ? 'Bật' : 'Tắt' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Watch History -->
          <div class="info-card full-width">
            <h2 class="card-title">
              <Clock :size="24" />
              Lịch sử xem gần đây
            </h2>
            <div class="history-list">
              <div v-for="item in userData.watchHistory" :key="item.movieId" class="history-item">
                <div class="history-info">
                  <h3>{{ item.title }}</h3>
                  <p class="history-date">{{ new Date(item.watchedAt).toLocaleDateString('vi-VN') }}</p>
                </div>
                <div class="history-meta">
                  <span class="duration">{{ item.duration }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="info-card danger-card full-width">
            <h2 class="card-title">
              <LogOut :size="24" />
              Tài khoản
            </h2>
            <div class="danger-actions">
              <button class="btn-danger" @click="handleLogout">
                <LogOut :size="20" />
                Đăng xuất
              </button>
              <button class="btn-danger-outline">
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.profile-content {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: var(--space-3xl);
}

/* Profile Header */
.profile-header {
  position: relative;
  margin-bottom: var(--space-3xl);
}

.profile-banner {
  height: 300px;
  background: linear-gradient(135deg, rgba(229, 9, 20, 0.3), rgba(139, 0, 139, 0.3));
  border-radius: var(--radius-xl);
  margin-bottom: calc(var(--space-3xl) * -1);
}

.profile-info {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-2xl);
  align-items: end;
  padding: 0 var(--space-2xl) var(--space-2xl);
}

.avatar-section {
  position: relative;
}

.profile-avatar {
  width: 180px;
  height: 180px;
  border-radius: var(--radius-xl);
  border: 5px solid var(--bg-primary);
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.subscription-badge {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  font-weight: 700;
  font-size: var(--font-size-sm);
  border-radius: var(--radius-full);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.user-details {
  padding-bottom: var(--space-md);
}

.user-name {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-xs);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-username {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-lg);
}

.user-stats {
  display: flex;
  gap: var(--space-2xl);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-base);
}

.stat-item svg {
  color: var(--accent-primary);
}

.profile-actions {
  display: flex;
  gap: var(--space-md);
  padding-bottom: var(--space-md);
}

.btn-action {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none;
  color: white;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4);
}

.btn-settings {
  background: var(--bg-elevated);
  border: 2px solid var(--border-color);
  color: var(--text-primary);
}

.btn-settings:hover {
  border-color: var(--accent-primary);
  background: var(--bg-card);
}

/* Profile Grid */
.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-xl);
}

.info-card {
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.6), rgba(20, 20, 40, 0.8));
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.card-title {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-xl);
  color: var(--text-primary);
}

.card-title svg {
  color: var(--accent-primary);
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.info-item {
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
}

.info-item svg {
  margin-top: 4px;
  color: var(--accent-primary);
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-content.full-width {
  width: 100%;
}

.info-content label {
  display: block;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-content p {
  color: var(--text-primary);
  font-size: var(--font-size-base);
  line-height: 1.6;
}

/* Subscription Details */
.subscription-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.sub-plan {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.plan-status {
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.plan-status.active {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}

.sub-pricing {
  text-align: center;
  padding: var(--space-xl);
  background: rgba(229, 9, 20, 0.1);
  border-radius: var(--radius-lg);
  border: 2px solid rgba(229, 9, 20, 0.3);
}

.price {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--accent-primary);
}

.sub-dates {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.date-item {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-base);
}

.date-item label {
  color: var(--text-secondary);
}

.date-item span {
  color: var(--text-primary);
  font-weight: 600;
}

.btn-renew {
  padding: var(--space-md) var(--space-xl);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none;
  border-radius: var(--radius-lg);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-renew:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

.stat-box {
  text-align: center;
  padding: var(--space-xl);
  background: rgba(229, 9, 20, 0.1);
  border-radius: var(--radius-lg);
  border: 2px solid rgba(229, 9, 20, 0.2);
  transition: all 0.3s;
}

.stat-box:hover {
  transform: translateY(-4px);
  border-color: var(--accent-primary);
  box-shadow: 0 8px 24px rgba(229, 9, 20, 0.3);
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: var(--space-sm);
}

.stat-label {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Genre Tags */
.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.genre-tag {
  padding: var(--space-xs) var(--space-md);
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid rgba(229, 9, 20, 0.4);
  border-radius: var(--radius-full);
  color: var(--accent-primary);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

/* Watch History */
.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-primary);
  transform: translateX(4px);
}

.history-info h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.history-date {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.duration {
  color: var(--accent-primary);
  font-weight: 600;
}

/* Danger Zone */
.danger-card {
  border-color: rgba(255, 0, 0, 0.2);
}

.danger-actions {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.btn-danger {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background: linear-gradient(135deg, #ff0000, #cc0000);
  border: none;
  border-radius: var(--radius-lg);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 0, 0, 0.4);
}

.btn-danger-outline {
  padding: var(--space-md) var(--space-xl);
  background: transparent;
  border: 2px solid rgba(255, 0, 0, 0.5);
  border-radius: var(--radius-lg);
  color: #ff5555;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-danger-outline:hover {
  border-color: #ff0000;
  background: rgba(255, 0, 0, 0.1);
  color: #ff0000;
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
  
  .info-card.full-width {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .profile-content {
    padding-top: 80px;
  }

  .profile-banner {
    height: 200px;
  }

  .profile-info {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--space-lg);
  }

  .profile-avatar {
    width: 120px;
    height: 120px;
  }

  .user-stats {
    justify-content: center;
  }

  .profile-actions {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
