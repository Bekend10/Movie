# 🎬 Movie App - Netflix Clone

Ứng dụng xem phim online được xây dựng với Vue.js 3, Composition API, và Vite.

## ✨ Tính Năng

- 🎥 Xem phim và series online chất lượng cao
- 🔥 Trending phim hot nhất
- ⭐ Top phim được đánh giá cao
- 🔍 Tìm kiếm phim nhanh chóng
- 📚 Duyệt phim theo thể loại
- ❤️ Danh sách yêu thích
- 👤 Quản lý hồ sơ người dùng
- 📺 Lịch sử xem phim
- 🎨 Dark theme Netflix-style
- 📱 Fully responsive design

## 🚀 Tech Stack

- **Framework**: Vue.js 3 (Composition API + `<script setup>`)
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Icons**: Lucide Vue
- **Styling**: Vanilla CSS với CSS Variables

## 📦 Cài Đặt

### Prerequisites

- Node.js >= 16.0.0
- npm hoặc yarn

### Các Bước Cài Đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd movie-app
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình environment variables**
Tạo file `.env` và cập nhật API URL:
```env
VITE_API_URL=http://localhost:3000/api
```

4. **Chạy development server**
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5173/

5. **Build for production**
```bash
npm run build
```

6. **Preview production build**
```bash
npm run preview
```

## 📂 Cấu Trúc Thư Mục

```
src/
├── assets/
│   └── css/                 # Design system CSS
│       ├── variables.css    # CSS variables
│       ├── base.css         # Base styles
│       ├── animations.css   # Animations
│       └── utilities.css    # Utility classes
├── components/
│   ├── layout/             # Layout components (Header, Footer)
│   ├── home/               # Home page components
│   ├── movie/              # Movie detail components
│   ├── player/             # Video player components
│   ├── search/             # Search components
│   ├── auth/               # Authentication components
│   ├── user/               # User profile components
│   └── shared/             # Shared/common components
├── composables/            # Reusable composition functions
├── stores/                 # Pinia stores
│   ├── authStore.js       # Authentication state
│   ├── movieStore.js      # Movies data
│   ├── watchlistStore.js  # Watchlist state
│   └── uiStore.js         # UI state
├── services/              # API services
│   ├── api.js            # Axios instance
│   ├── authService.js    # Auth API calls
│   ├── movieService.js   # Movie API calls
│   └── userService.js    # User API calls
├── router/               # Vue Router config
├── views/                # Page-level components
├── App.vue              # Root component
└── main.js              # Entry point
```

## 🎨 Design System

### Colors
- **Primary Background**: #0d0d0d (Gần đen)
- **Accent**: #e50914 (Đỏ Netflix)
- **Text Primary**: #ffffff
- **Text Secondary**: #b3b3b3

### Typography
- **Font Family**: Inter
- **Hero Title**: 4rem (64px)
- **Section Title**: 1.5rem (24px)  
- **Body Text**: 1rem (16px)

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1440px
- **Large**: > 1440px

## 🔗 API Integration

Ứng dụng sử dụng RESTful API với các endpoints:

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/profile` - Lấy thông tin user

### Movies
- `GET /api/movies/trending` - Phim trending
- `GET /api/movies/top-rated` - Phim top rated
- `GET /api/movies/:id` - Chi tiết phim
- `GET /api/movies/search` - Tìm kiếm phim

### Watchlist
- `GET /api/user/watchlist` - Lấy danh sách yêu thích
- `POST /api/user/watchlist` - Thêm vào danh sách
- `DELETE /api/user/watchlist/:id` - Xóa khỏi danh sách

## 🛠️ Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Style

- **Component naming**: PascalCase (e.g., `MovieCard.vue`)
- **File naming**: PascalCase cho components, camelCase cho utils/services
- **Composition API**: Sử dụng `<script setup>` syntax
- **Styling**: Scoped CSS trong mỗi component

## 📱 Features Overview

### 1. Trang Chủ (HomePage)
- Hero banner với auto-rotate
- Movie carousels theo nhiều categories
- Responsive grid layout

### 2. Chi Tiết Phim (MovieDetailPage)
- Backdrop image với gradient overlay
- Thông tin chi tiết phim
- Cast & crew
- Reviews
- Phim tương tự

### 3. Xem Phim (PlayerPage)
- Full-screen video player
- Custom controls
- Keyboard shortcuts
- Auto-play next episode

### 4. Tìm Kiếm (SearchPage)
- Real-time search với debounce
- Advanced filters
- Grid results layout

### 5. Xác Thực (Login/Register)
- Glassmorphism design
- Form validation
- Social login (coming soon)

## 🎯 Roadmap

- [x] Phase 1: Foundation & Setup
- [x] Phase 2: Layout & Navigation
- [x] Phase 3: Homepage
- [ ] Phase 4: Movie Detail & Player
- [ ] Phase 5: Search & Browse
- [ ] Phase 6: Authentication & User Profile
- [ ] Phase 7: Polish & Optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

NETFLEX Team

---

Made with ❤️ using Vue.js 3
