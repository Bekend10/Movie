<script setup>
import { Github, Mail, Facebook, Instagram, Twitter } from 'lucide-vue-next'
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <!-- Footer Top -->
        <div class="footer-top">
          <!-- Brand -->
          <div class="footer-section">
            <h3 class="footer-logo">NET<span>FLEX</span></h3>
            <p class="footer-desc">
              Xem phim online chất lượng cao với kho phim đa dạng và phong phú.
            </p>
            <!-- Social Links -->
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <Facebook :size="20" />
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <Instagram :size="20" />
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <Twitter :size="20" />
              </a>
              <a href="#" class="social-link" aria-label="GitHub">
                <Github :size="20" />
              </a>
            </div>
          </div>

          <!-- Links 1 -->
          <div class="footer-section">
            <h4 class="footer-title">Khám Phá</h4>
            <ul class="footer-links">
              <li><router-link to="/">Trang Chủ</router-link></li>
              <li><router-link to="/browse">Duyệt Phim</router-link></li>
              <li><router-link to="/browse?type=movies">Phim Lẻ</router-link></li>
              <li><router-link to="/browse?type=series">Phim Bộ</router-link></li>
            </ul>
          </div>

          <!-- Links 2 -->
          <div class="footer-section">
            <h4 class="footer-title">Thể Loại</h4>
            <ul class="footer-links">
              <li><router-link to="/browse/action">Hành Động</router-link></li>
              <li><router-link to="/browse/comedy">Hài Hước</router-link></li>
              <li><router-link to="/browse/drama">Tâm Lý</router-link></li>
              <li><router-link to="/browse/horror">Kinh Dị</router-link></li>
            </ul>
          </div>

          <!-- Links 3 -->
          <div class="footer-section">
            <h4 class="footer-title">Hỗ Trợ</h4>
            <ul class="footer-links">
              <li><a href="#">Liên Hệ</a></li>
              <li><a href="#">Câu Hỏi Thường Gặp</a></li>
              <li><a href="#">Điều Khoản Sử Dụng</a></li>
              <li><a href="#">Chính Sách Bảo Mật</a></li>
            </ul>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <p class="copyright">
            &copy; {{ new Date().getFullYear() }} NetFlex. All rights reserved.
          </p>
          <p class="made-with">
            Made with ❤️ by NetFlex Team
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--bg-secondary);
  padding: var(--space-3xl) 0 var(--space-lg);
  margin-top: var(--space-3xl);
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

/* Footer Top */
.footer-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--space-2xl);
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* Brand */
.footer-logo {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.footer-logo span {
  color: var(--accent-primary);
}

.footer-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Social Links */
.social-links {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--bg-elevated);
  color: var(--text-primary);
  transition: var(--transition-base);
}

.social-link:hover {
  background-color: var(--accent-primary);
  transform: translateY(-3px);
  box-shadow: var(--shadow-glow);
}

/* Footer Links */
.footer-title {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-links li {
  list-style: none;
}

.footer-links a {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  transition: var(--transition-base);
}

.footer-links a:hover {
  color: var(--text-primary);
  padding-left: var(--space-xs);
}

/* Footer Bottom */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--bg-elevated);
}

.copyright,
.made-with {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .app-footer {
    padding: var(--space-2xl) 0 var(--space-md);
  }

  .footer-top {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  .footer-bottom {
    flex-direction: column;
    gap: var(--space-sm);
    text-align: center;
  }
}
</style>
