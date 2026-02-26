# 🎬 Kế Hoạch Xây Dựng Frontend Xem Phim (Netflix-like) — Vue.js 3

---

## 1. Tổng Quan Dự Án

Xây dựng giao diện xem phim streaming tương tự **Netflix** sử dụng **Vue.js 3 + Composition API + Vite**. Backend API đã có sẵn, frontend tập trung vào UI/UX premium với **dark theme**, **animations mượt mà**, và **responsive design**.

---

## 2. Tech Stack

| Thành phần           | Công nghệ                                     |
| -------------------- | --------------------------------------------- |
| **Framework**        | Vue.js 3 (Composition API + `<script setup>`) |
| **Build Tool**       | Vite                                          |
| **Routing**          | Vue Router 4                                  |
| **State Management** | Pinia                                         |
| **HTTP Client**      | Axios                                         |
| **CSS**              | Vanilla CSS (custom properties, dark theme)   |
| **Icons**            | Lucide Vue hoặc Heroicons                     |
| **Animations**       | CSS Animations + Vue Transition               |
| **Video Player**     | Video.js hoặc Plyr                            |
| **Font**             | Google Fonts — Inter                          |

---

## 3. Kiến Trúc Thư Mục

```
src/
├── assets/
│   ├── css/
│   │   ├── variables.css          # Design tokens (colors, spacing, fonts)
│   │   ├── base.css               # CSS reset, global styles, dark theme
│   │   ├── animations.css         # Keyframe animations (fade, slide, scale)
│   │   └── utilities.css          # Utility classes
│   ├── images/                    # Logo, static images
│   └── fonts/                     # Custom fonts (nếu cần)
│
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue          # Thanh navigation (logo, search, user menu)
│   │   ├── AppFooter.vue          # Footer
│   │   └── AppSidebar.vue         # Sidebar thể loại (optional)
│   │
│   ├── home/
│   │   ├── HeroBanner.vue         # Banner phim nổi bật (auto-rotate)
│   │   ├── MovieCarousel.vue      # Carousel ngang (scroll mượt, prev/next)
│   │   ├── MovieCard.vue          # Card phim (poster + hover preview)
│   │   └── GenreRow.vue           # Hàng phim theo thể loại
│   │
│   ├── movie/
│   │   ├── MovieInfo.vue          # Thông tin phim (title, mô tả, rating)
│   │   ├── MovieTrailer.vue       # Trailer player
│   │   ├── MovieCast.vue          # Danh sách diễn viên
│   │   ├── MovieReviews.vue       # Đánh giá/bình luận
│   │   ├── SimilarMovies.vue      # Phim tương tự
│   │   └── EpisodeList.vue        # Danh sách tập (cho series)
│   │
│   ├── player/
│   │   ├── VideoPlayer.vue        # Video player chính
│   │   ├── PlayerControls.vue     # Custom controls (play, volume, progress)
│   │   └── SubtitleSelector.vue   # Chọn phụ đề/audio
│   │
│   ├── search/
│   │   ├── SearchBar.vue          # Ô tìm kiếm + autocomplete
│   │   ├── SearchResults.vue      # Grid kết quả
│   │   └── FilterPanel.vue        # Bộ lọc (genre, năm, rating)
│   │
│   ├── auth/
│   │   ├── LoginForm.vue          # Form đăng nhập
│   │   ├── RegisterForm.vue       # Form đăng ký
│   │   └── ForgotPassword.vue     # Quên mật khẩu
│   │
│   ├── user/
│   │   ├── UserProfile.vue        # Cài đặt hồ sơ
│   │   ├── WatchHistory.vue       # Lịch sử xem
│   │   └── Watchlist.vue          # Danh sách yêu thích
│   │
│   └── shared/
│       ├── LoadingSpinner.vue     # Loading indicator
│       ├── SkeletonLoader.vue     # Skeleton placeholder
│       ├── RatingStars.vue        # Hiển thị đánh giá sao
│       ├── ToastNotification.vue  # Toast thông báo
│       └── ConfirmDialog.vue      # Modal xác nhận
│
├── composables/                   # Reusable composition functions
│   ├── useAuth.js                 # Logic xác thực
│   ├── useMovies.js               # Fetch + cache phim
│   ├── useSearch.js               # Tìm kiếm với debounce
│   ├── useInfiniteScroll.js       # Phân trang infinite scroll
│   └── useMediaQuery.js           # Responsive breakpoints
│
├── stores/                        # Pinia stores
│   ├── authStore.js               # State đăng nhập/user
│   ├── movieStore.js              # Cache dữ liệu phim
│   ├── uiStore.js                 # State UI (sidebar, modals, loading)
│   └── watchlistStore.js          # State danh sách yêu thích
│
├── services/                      # API service layer
│   ├── api.js                     # Axios instance + interceptors
│   ├── authService.js             # API calls xác thực
│   ├── movieService.js            # API calls lấy phim
│   └── userService.js             # API calls user
│
├── router/
│   └── index.js                   # Vue Router setup + auth guards
│
├── views/                         # Page-level components
│   ├── HomePage.vue               # Trang chủ
│   ├── MovieDetailPage.vue        # Trang chi tiết phim
│   ├── BrowsePage.vue             # Duyệt phim theo thể loại
│   ├── SearchPage.vue             # Trang tìm kiếm
│   ├── PlayerPage.vue             # Trang xem phim (full-screen)
│   ├── LoginPage.vue              # Trang đăng nhập
│   ├── RegisterPage.vue           # Trang đăng ký
│   ├── ProfilePage.vue            # Trang hồ sơ
│   ├── WatchlistPage.vue          # Trang danh sách yêu thích
│   └── NotFoundPage.vue           # Trang 404
│
├── App.vue                        # Root component
└── main.js                        # Entry point
```

---

## 4. Design System

### 4.1 Bảng Màu (Dark Theme)

```css
:root {
  /* Backgrounds */
  --bg-primary: #0d0d0d; /* Nền chính (gần đen) */
  --bg-secondary: #1a1a2e; /* Nền phụ (navy tối) */
  --bg-card: #16213e; /* Nền card (xanh tối) */
  --bg-elevated: #1f2937; /* Nền nổi (dropdown, modal) */
  --bg-overlay: rgba(0, 0, 0, 0.7); /* Overlay */

  /* Accent */
  --accent-primary: #e50914; /* Đỏ Netflix */
  --accent-hover: #f40612; /* Đỏ hover */
  --accent-secondary: #b20710; /* Đỏ tối */
  --accent-gold: #ffbe0b; /* Vàng (rating) */
  --accent-green: #46d369; /* Xanh lá (badge "Mới") */

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-muted: #6b7280;
  --text-link: #e50914;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 50%;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.7);
  --shadow-glow: 0 0 20px rgba(229, 9, 20, 0.3);

  /* Transition */
  --transition-fast: all 0.15s ease;
  --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  /* Typography */
  --font-family: "Inter", "Segoe UI", -apple-system, sans-serif;
  --font-size-xs: 0.75rem; /* 12px */
  --font-size-sm: 0.875rem; /* 14px */
  --font-size-base: 1rem; /* 16px */
  --font-size-lg: 1.125rem; /* 18px */
  --font-size-xl: 1.5rem; /* 24px */
  --font-size-2xl: 2rem; /* 32px */
  --font-size-3xl: 3rem; /* 48px */
  --font-size-hero: 4rem; /* 64px */

  /* Z-Index */
  --z-dropdown: 100;
  --z-header: 200;
  --z-modal: 300;
  --z-toast: 400;
  --z-tooltip: 500;
}
```

### 4.2 Typography

- **Hero title**: `4rem`, `font-weight: 800`, `letter-spacing: -0.02em`
- **Section title**: `1.5rem`, `font-weight: 700`
- **Card title**: `1rem`, `font-weight: 600`
- **Body text**: `0.875rem – 1rem`, `font-weight: 400`, `line-height: 1.6`
- **Caption/meta**: `0.75rem`, `font-weight: 400`, `color: var(--text-muted)`

---

## 5. Chi Tiết Từng Trang

### 5.1 🏠 Trang Chủ (HomePage)

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│  HEADER: Logo | Trang Chủ | Phim | Series | Search | Avatar  │
├─────────────────────────────────────────────────────┤
│                                                     │
│              HERO BANNER (100vw x 80vh)             │
│        ┌──────────────────────────┐                 │
│        │  Movie Title             │                 │
│        │  ★ 8.5 | 2024 | 2h 15m  │                 │
│        │  Description (3 lines)   │                 │
│        │  [▶ Xem Ngay] [ℹ Info]  │                 │
│        └──────────────────────────┘                 │
│        ● ○ ○ ○ ○  (dot indicators)                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│  🔥 Trending Now                          [< >]    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │       │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘       │
│                                                     │
├─────────────────────────────────────────────────────┤
│  🏆 Top 10 Phim Hôm Nay                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │1 🎬  │ │2 🎬  │ │3 🎬  │ │4 🎬  │              │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
├─────────────────────────────────────────────────────┤
│  🎭 Hành Động                             [< >]    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│                                                     │
│  😂 Hài Hước                              [< >]    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│                                                     │
│  📺 Tiếp Tục Xem                          [< >]    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│                                                     │
├─────────────────────────────────────────────────────┤
│  FOOTER                                            │
└─────────────────────────────────────────────────────┘
```

**Chi tiết component:**

#### HeroBanner.vue

- **Kích thước**: `width: 100vw`, `height: 80vh` (min 500px)
- **Background**: Ảnh backdrop phim (lazy load), `background-size: cover`, `background-position: center`
- **Gradient overlay**: `linear-gradient(to top, var(--bg-primary), transparent 60%)`
- **Auto-rotate**: Mỗi 8 giây, transition `opacity 1s ease-in-out`
- **Dot indicators**: Ở giữa phía dưới, dot active có `background: var(--accent-primary)`
- **Nút CTA**:
  - "▶ Xem Ngay": `background: var(--accent-primary)`, `padding: 12px 28px`, `border-radius: var(--radius-lg)`, icon play bên trái
  - "ℹ Thêm Thông Tin": `background: rgba(109, 109, 110, 0.7)`, `backdrop-filter: blur(4px)`
- **Responsive**: Trên mobile, `height: 60vh`, title `font-size: 2rem`, ẩn description

#### MovieCarousel.vue

- **Title section**: Tên thể loại bên trái, nút prev/next bên phải
- **Scroll container**: `display: flex`, `overflow-x: auto`, `scroll-snap-type: x mandatory`, `gap: 12px`
- **Ẩn scrollbar**: `-webkit-scrollbar: display: none`
- **Nút prev/next**: Hiện khi hover vào carousel, `position: absolute`, mũi tên `>` `<`, nền gradient fade
- **Scroll behavior**: `scroll-behavior: smooth`, mỗi lần scroll = chiều rộng 1 viewport

#### MovieCard.vue

- **Kích thước default**: `width: 200px`, aspect ratio `2:3` (poster dọc)
- **Border radius**: `var(--radius-md)`
- **Hover effect**:
  - `transform: scale(1.4)` + `z-index: 10`
  - Transition: `transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)`
  - Hiện info overlay phía dưới: title, năm, rating, genre tags
  - Hiện quick action buttons: ▶ Play, ❤️ Add to List, 👍 Like
  - Box shadow: `var(--shadow-lg)`
- **Lazy load**: Dùng `loading="lazy"` hoặc IntersectionObserver
- **Skeleton**: Hiển thị skeleton shimmer khi ảnh chưa load

---

### 5.2 🎬 Trang Chi Tiết Phim (MovieDetailPage)

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│  HEADER (transparent, trên backdrop)                │
├─────────────────────────────────────────────────────┤
│              BACKDROP IMAGE (100vw x 60vh)          │
│        gradient overlay (bottom + left)             │
│                                                     │
│  ┌─ INFO PANEL ───────────────────────────────────┐ │
│  │  Movie Title                          [Rating] │ │
│  │  2024 • 2h 15m • PG-13                         │ │
│  │  ┌──────┐ ┌─────┐ ┌──────────┐               │ │
│  │  │Action│ │Drama│ │Sci-Fi    │  (genre tags)  │ │
│  │  └──────┘ └─────┘ └──────────┘               │ │
│  │                                                │ │
│  │  Mô tả phim dài vài dòng, có nút "Xem thêm"  │ │
│  │  nếu quá dài...                                │ │
│  │                                                │ │
│  │  [▶ Xem Phim] [+ Danh Sách] [👍] [↗ Chia Sẻ] │ │
│  └────────────────────────────────────────────────┘ │
│                                                     │
├─────────────────────────────────────────────────────┤
│  📺 Danh Sách Tập (nếu là series)                  │
│  Season selector dropdown                           │
│  ┌──────────────────────────────────────┐           │
│  │ Ep 1: Title  | 45min | Description  │           │
│  │ Ep 2: Title  | 42min | Description  │           │
│  └──────────────────────────────────────┘           │
│                                                     │
├─────────────────────────────────────────────────────┤
│  👥 Diễn Viên & Đoàn Làm Phim                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│  │ Ava  │ │ Ava  │ │ Ava  │ │ Ava  │ (scroll)    │
│  │ Name │ │ Name │ │ Name │ │ Name │              │
│  │ Role │ │ Role │ │ Role │ │ Role │              │
│  └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
├─────────────────────────────────────────────────────┤
│  💬 Đánh Giá & Bình Luận                            │
│  ┌────────────────────────────────┐                 │
│  │ User Avatar | Name | ★★★★☆    │                 │
│  │ Comment text...                │                 │
│  └────────────────────────────────┘                 │
│  [Viết đánh giá]                                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│  🎬 Phim Tương Tự                         [< >]    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │               │
│  └────┘ └────┘ └────┘ └────┘ └────┘               │
│                                                     │
├─────────────────────────────────────────────────────┤
│  FOOTER                                            │
└─────────────────────────────────────────────────────┘
```

**Chi tiết:**

- **Backdrop**: `height: 60vh`, gradient 2 hướng (dưới lên + trái sang)
- **Genre tags**: `background: rgba(255,255,255,0.1)`, `border: 1px solid rgba(255,255,255,0.2)`, `border-radius: var(--radius-xl)`
- **Cast cards**: Avatar tròn `80px`, tên bên dưới, horizontal scroll
- **Episode list**: Mỗi episode là row, hover highlight, thumbnail bên trái
- **Rating badge**: Hình tròn hoặc vuông bo, màu theo rating (xanh > 7, vàng > 5, đỏ < 5)

---

### 5.3 🔍 Trang Tìm Kiếm (SearchPage)

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│  HEADER                                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  🔍  Tìm kiếm phim, series, diễn viên...   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Filters: [Thể loại ▼] [Năm ▼] [Rating ▼] [Sắp xếp ▼] │
│                                                     │
│  Kết quả cho "keyword" (24 kết quả)                 │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │               │
│  ├────┤ ├────┤ ├────┤ ├────┤ ├────┤               │
│  │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │               │
│  ├────┤ ├────┤ ├────┤ ├────┤ ├────┤               │
│  │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │               │
│  └────┘ └────┘ └────┘ └────┘ └────┘               │
│                                                     │
│  [Load more... / Infinite scroll]                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  FOOTER                                            │
└─────────────────────────────────────────────────────┘
```

**Chi tiết:**

- **Search input**: `font-size: 1.25rem`, `padding: 16px 24px`, icon search bên trái, clear button bên phải
- **Autocomplete dropdown**: Hiện sau khi gõ 2+ ký tự, debounce 300ms, hiển thị poster nhỏ + title
- **Filter chips**: Horizontal scroll trên mobile, dropdown trên desktop
- **Results grid**: CSS Grid `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`
- **Empty state**: Illustration + text "Không tìm thấy kết quả"
- **Infinite scroll**: Dùng IntersectionObserver, hiện spinner khi đang load thêm

---

### 5.4 ▶ Trang Xem Phim (PlayerPage)

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                VIDEO PLAYER (100vw x 100vh)         │
│                                                     │
│                                                     │
│  ┌── Controls (hiện khi hover/tap) ───────────────┐ │
│  │  ← Quay lại | Movie Title                      │ │
│  │                                                 │ │
│  │               advancement progress bar             │ │
│  │  ▶/⏸ |◄◄| ►►| 🔊━━━ | 01:23/2:15:00 | CC | ⛶│ │
│  └─────────────────────────────────────────────────┘ │
│                                                     │
│  ── Tập Tiếp Theo (auto-show trước khi hết) ──     │
│  │ Tự động phát tập tiếp theo trong 10s [Hủy]  │   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Chi tiết:**

- **Full-screen**: `width: 100vw`, `height: 100vh`, ẩn header/footer
- **Controls**: Auto-hide sau 3 giây không tương tác, hiện khi di chuột
- **Progress bar**: Thanh tiến trình mỏng phía dưới, hover thì phóng to + hiện thumbnail preview
- **Keyboard shortcuts**:
  - `Space` / `K`: Play/Pause
  - `F`: Fullscreen toggle
  - `M`: Mute toggle
  - `←` / `→`: Tua 10 giây
  - `J` / `L`: Tua 10 giây
  - `↑` / `↓`: Tăng/giảm âm lượng
- **Subtitle selector**: Dropdown chọn phụ đề + ngôn ngữ audio
- **Picture-in-Picture**: Nút PiP để xem phim trong cửa sổ nhỏ
- **Next episode**: Popup hiện 30 giây trước khi hết, đếm ngược 10 giây rồi auto-play

---

### 5.5 🔐 Trang Đăng Nhập (LoginPage)

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│          Background: Collage ảnh phim (blur)        │
│                                                     │
│          ┌─── Glassmorphism Card ───────────┐       │
│          │                                  │       │
│          │         🎬 MOVIE APP             │       │
│          │                                  │       │
│          │  Email                            │       │
│          │  ┌──────────────────────────┐    │       │
│          │  │ email@example.com        │    │       │
│          │  └──────────────────────────┘    │       │
│          │                                  │       │
│          │  Mật khẩu                        │       │
│          │  ┌──────────────────────────┐    │       │
│          │  │ ••••••••          👁     │    │       │
│          │  └──────────────────────────┘    │       │
│          │                                  │       │
│          │  ☐ Ghi nhớ đăng nhập             │       │
│          │                                  │       │
│          │  [      Đăng Nhập      ]         │       │
│          │                                  │       │
│          │  ─── HOẶC ───                    │       │
│          │                                  │       │
│          │  [G  Google] [f  Facebook]       │       │
│          │                                  │       │
│          │  Quên mật khẩu?                  │       │
│          │  Chưa có tài khoản? Đăng ký      │       │
│          │                                  │       │
│          └──────────────────────────────────┘       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Chi tiết:**

- **Background**: Grid/collage ảnh poster phim, `filter: blur(10px) brightness(0.3)`
- **Card**: `background: rgba(0, 0, 0, 0.75)`, `backdrop-filter: blur(20px)`, `border: 1px solid rgba(255,255,255,0.1)`, `border-radius: var(--radius-xl)`, `max-width: 440px`
- **Input fields**: `background: #333`, `border: 1px solid #555`, focus → `border-color: var(--accent-primary)`, `padding: 14px 16px`
- **Button Đăng Nhập**: Full width, `background: var(--accent-primary)`, hover → lighten, `height: 48px`
- **Validation**: Real-time, hiện lỗi dưới input bằng text đỏ + icon warning
- **Transition** Login ↔ Register: Vue `<Transition>` fade hoặc slide

---

### 5.6 👤 Trang Hồ Sơ (ProfilePage)

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│  HEADER                                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌── Profile Header ───────────────────────────┐    │
│  │ ┌──────┐                                    │    │
│  │ │Avatar│  Username                          │    │
│  │ │ 80px │  email@example.com                 │    │
│  │ └──────┘  Thành viên từ: 01/2024            │    │
│  │           [Chỉnh sửa hồ sơ]                │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Tabs: [Danh sách] [Lịch sử xem] [Cài đặt]        │
│                                                     │
│  ── Danh Sách Yêu Thích ──                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │               │
│  └────┘ └────┘ └────┘ └────┘ └────┘               │
│                                                     │
│  ── Lịch Sử Xem ──                                 │
│  ┌────────────────────────────────────┐             │
│  │ Poster | Title | Progress Bar 75% │             │
│  │ Poster | Title | Progress Bar 30% │             │
│  └────────────────────────────────────┘             │
│                                                     │
├─────────────────────────────────────────────────────┤
│  FOOTER                                            │
└─────────────────────────────────────────────────────┘
```

---

### 5.7 📂 Trang Duyệt Phim (BrowsePage)

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│  HEADER                                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Duyệt Phim: [Tất Cả ▼] [Sắp xếp: Mới nhất ▼]    │
│                                                     │
│  Genre chips (horizontal scroll):                   │
│  [Tất cả] [Hành Động] [Hài] [Kinh Dị] [Tình Cảm]  │
│  [Khoa Học] [Hoạt Hình] [Tài Liệu] ...            │
│                                                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │               │
│  ├────┤ ├────┤ ├────┤ ├────┤ ├────┤               │
│  │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │               │
│  ├────┤ ├────┤ ├────┤ ├────┤ ├────┤               │
│  │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │               │
│  └────┘ └────┘ └────┘ └────┘ └────┘               │
│                                                     │
│  [Load more...]                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│  FOOTER                                            │
└─────────────────────────────────────────────────────┘
```

---

## 6. Routing Plan

| Path                | Component            | Auth | Mô tả                   |
| ------------------- | -------------------- | ---- | ----------------------- |
| `/`                 | `HomePage`           | ❌   | Trang chủ               |
| `/movie/:id`        | `MovieDetailPage`    | ❌   | Chi tiết phim           |
| `/browse`           | `BrowsePage`         | ❌   | Duyệt tất cả phim       |
| `/browse/:genre`    | `BrowsePage`         | ❌   | Duyệt theo thể loại     |
| `/search`           | `SearchPage`         | ❌   | Tìm kiếm                |
| `/search?q=keyword` | `SearchPage`         | ❌   | Tìm kiếm với keyword    |
| `/watch/:id`        | `PlayerPage`         | ✅   | Xem phim                |
| `/watch/:id?ep=1`   | `PlayerPage`         | ✅   | Xem tập cụ thể (series) |
| `/login`            | `LoginPage`          | ❌   | Đăng nhập               |
| `/register`         | `RegisterPage`       | ❌   | Đăng ký                 |
| `/forgot-password`  | `ForgotPasswordPage` | ❌   | Quên mật khẩu           |
| `/profile`          | `ProfilePage`        | ✅   | Hồ sơ cá nhân           |
| `/watchlist`        | `WatchlistPage`      | ✅   | Danh sách yêu thích     |
| `/:pathMatch(.*)*`  | `NotFoundPage`       | ❌   | Trang 404               |

**Navigation Guards:**

- Routes có Auth ✅ → check `authStore.isLoggedIn`, nếu chưa đăng nhập → redirect `/login?redirect=originalPath`
- Đã đăng nhập mà vào `/login` hoặc `/register` → redirect `/`

---

## 7. State Management (Pinia Stores)

### authStore.js

```javascript
state: {
  user: null,           // { id, name, email, avatar }
  token: null,          // JWT token
  isLoggedIn: false,
  loading: false
}
actions: {
  login(credentials),   // POST /api/auth/login
  register(data),       // POST /api/auth/register
  logout(),             // Clear state + localStorage
  fetchProfile(),       // GET /api/auth/profile
  refreshToken()        // POST /api/auth/refresh
}
```

### movieStore.js

```javascript
state: {
  trending: [],         // Danh sách phim trending
  topRated: [],         // Phim đánh giá cao
  genres: [],           // Danh sách thể loại
  moviesByGenre: {},    // { genreName: [movies] }
  currentMovie: null,   // Chi tiết phim đang xem
  continueWatching: [], // Phim đang xem dở
  loading: false
}
actions: {
  fetchTrending(),           // GET /api/movies/trending
  fetchTopRated(),           // GET /api/movies/top-rated
  fetchGenres(),             // GET /api/genres
  fetchMoviesByGenre(genre), // GET /api/movies?genre=...
  fetchMovieDetail(id),      // GET /api/movies/:id
  fetchSimilarMovies(id)     // GET /api/movies/:id/similar
}
```

### watchlistStore.js

```javascript
state: {
  items: [],            // Phim trong danh sách
  loading: false
}
actions: {
  fetchWatchlist(),      // GET /api/watchlist
  addToWatchlist(movieId),    // POST /api/watchlist
  removeFromWatchlist(movieId) // DELETE /api/watchlist/:id
}
```

### uiStore.js

```javascript
state: {
  isSidebarOpen: false,
  isSearchOpen: false,
  toast: { show: false, message: '', type: 'info' },
  globalLoading: false
}
actions: {
  toggleSidebar(),
  toggleSearch(),
  showToast(message, type),
  hideToast()
}
```

---

## 8. API Service Layer

### api.js (Axios Instance)

```javascript
// Base config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401 → refresh token or logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Try refresh token, or redirect to login
    }
    return Promise.reject(error);
  },
);
```

---

## 9. Composables (Reusable Logic)

### useSearch.js

```javascript
// Debounced search với autocomplete
export function useSearch() {
  const query = ref("");
  const results = ref([]);
  const suggestions = ref([]);
  const isSearching = ref(false);

  // Debounce 300ms trước khi gọi API
  const debouncedSearch = useDebounceFn(async (q) => {
    isSearching.value = true;
    results.value = await movieService.search(q);
    isSearching.value = false;
  }, 300);

  watch(query, (newVal) => {
    if (newVal.length >= 2) debouncedSearch(newVal);
    else results.value = [];
  });

  return { query, results, suggestions, isSearching };
}
```

### useInfiniteScroll.js

```javascript
// Tự động load thêm khi scroll gần cuối trang
export function useInfiniteScroll(fetchFn) {
  const page = ref(1);
  const hasMore = ref(true);
  const loading = ref(false);
  const sentinel = ref(null); // template ref

  onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loading.value) {
        loadMore();
      }
    });
    if (sentinel.value) observer.observe(sentinel.value);
  });

  async function loadMore() {
    loading.value = true;
    const newItems = await fetchFn(page.value + 1);
    if (newItems.length === 0) hasMore.value = false;
    else page.value++;
    loading.value = false;
  }

  return { page, hasMore, loading, sentinel };
}
```

---

## 10. Animation Guidelines

### Transitions giữa các trang (Vue Router)

```css
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up transition (cho modal, detail page) */
.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
```

### Micro-animations

- **Button hover**: `transform: translateY(-2px)`, `box-shadow` tăng lên
- **Card hover**: `scale(1.05)` (nhẹ) hoặc `scale(1.4)` (carousel Netflix-style)
- **Loading skeleton**: Shimmer effect `background: linear-gradient(90deg, #1a1a2e 25%, #2a2a4e 50%, #1a1a2e 75%)`, `animation: shimmer 1.5s infinite`
- **Toast**: Slide in từ phải, auto-dismiss sau 3 giây
- **Page scroll**: Các section fade-in khi scroll vào viewport (IntersectionObserver)

---

## 11. Responsive Breakpoints

| Breakpoint  | Width         | Columns (Grid) | Card Width |
| ----------- | ------------- | -------------- | ---------- |
| **Mobile**  | `< 640px`     | 2              | 140px      |
| **Tablet**  | `640–1024px`  | 3–4            | 160px      |
| **Desktop** | `1024–1440px` | 5–6            | 200px      |
| **Large**   | `> 1440px`    | 7–8            | 220px      |

**Responsive rules:**

- Header: Hamburger menu trên mobile, full nav trên desktop
- Hero banner: `80vh` desktop → `60vh` tablet → `50vh` mobile
- Search: Full-screen overlay trên mobile
- Carousel: Touch swipe trên mobile, arrows trên desktop
- Movie card hover scale: Disabled trên touch devices

---

## 12. Thứ Tự Triển Khai (Phases)

### Phase 1: Foundation (Ưu tiên cao nhất)

1. Khởi tạo Vue 3 + Vite project
2. Cài đặt dependencies (vue-router, pinia, axios)
3. Setup design system (CSS variables, base styles, animations)
4. Setup Axios instance + API service layer
5. Setup Vue Router + Pinia stores

### Phase 2: Layout & Navigation

6. Build `AppHeader.vue` (responsive, scroll effect)
7. Build `AppFooter.vue`
8. Setup `App.vue` với layout wrapper

### Phase 3: Trang Chủ

9. Build `HeroBanner.vue` (auto-rotate, CTA)
10. Build `MovieCard.vue` (hover effects)
11. Build `MovieCarousel.vue` (horizontal scroll, arrows)
12. Assemble `HomePage.vue`

### Phase 4: Chi Tiết & Player

13. Build `MovieDetailPage.vue` (backdrop, info, cast, reviews)
14. Build `VideoPlayer.vue` (custom controls)
15. Build `PlayerPage.vue`

### Phase 5: Tìm Kiếm & Duyệt

16. Build `SearchPage.vue` (autocomplete, filters, grid)
17. Build `BrowsePage.vue` (genre chips, infinite scroll)

### Phase 6: Auth & User

18. Build `LoginPage.vue` (glassmorphism form)
19. Build `RegisterPage.vue`
20. Build `ProfilePage.vue`
21. Build `WatchlistPage.vue`

### Phase 7: Polish

22. Thêm skeleton loading cho tất cả pages
23. Thêm page transition animations
24. Error handling + empty states
25. Performance optimization (lazy loading, code splitting)
26. SEO (meta tags, title)
27. `NotFoundPage.vue` (404)

---

## 13. Performance Optimization

- **Code splitting**: Lazy load routes với `() => import('./views/...')`
- **Image optimization**: Lazy load images, dùng `srcset` cho responsive images, format WebP
- **Component lazy loading**: `defineAsyncComponent()` cho các component nặng (VideoPlayer)
- **Virtual scrolling**: Dùng cho danh sách dài (search results, browse)
- **Cache API responses**: Pinia store giữ data đã fetch, tránh re-fetch
- **Debounce**: Search input, scroll events, resize events

---

## 14. Lưu Ý Quan Trọng

> **Mock Data**: Trong giai đoạn phát triển UI, sẽ sử dụng mock data (JSON tĩnh) cho tất cả components. Sau khi UI hoàn thiện, sẽ kết nối với API thật bằng cách thay thế mock functions trong services.

> **Env Config**: Tạo file `.env` với `VITE_API_URL=http://localhost:xxxx/api` để config API base URL.

> **Font Loading**: Import Google Fonts (Inter) trong `index.html` để đảm bảo typography nhất quán.
