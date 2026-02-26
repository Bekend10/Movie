# 🎬 Movie App - Deployment Guide

## 📦 Đã Chuẩn Bị

✅ **vercel.json** - Cấu hình routing cho Vue SPA
✅ **.env.production** - Environment variables cho production
✅ **vite.config.js** - Tối ưu hóa build với code splitting

## 🚀 Deploy Lên Vercel

### Option 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. **Push code lên GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import vào Vercel**
   - Truy cập [vercel.com](https://vercel.com)
   - Đăng nhập với GitHub
   - Click "Add New..." → "Project"
   - Chọn repository này
   - Click "Import"

3. **Configure (tự động detect)**
   - Framework Preset: Vite ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅

4. **Environment Variables** (Optional)
   - `VITE_AUTH_API_URL` - URL backend API của bạn (nếu có)
   - Các biến khác đã có trong `.env.production`

5. **Deploy** → Đợi ~2 phút → Xong! 🎉

### Option 2: Deploy qua CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (lần đầu)
vercel

# Deploy to production
vercel --prod
```

## 🧪 Test Build Locally Trước Khi Deploy

```bash
# Build production
npm run build

# Preview build
npm run preview

# Mở http://localhost:4173
```

## 🔧 Cấu Hình Đã Làm

### 1. vercel.json
- ✅ SPA routing (tất cả routes → index.html)
- ✅ Static assets caching (1 năm)
- ✅ Security headers (XSS, CSRF protection)

### 2. .env.production
- ✅ OPhim API URL
- ✅ App config
- ⚠️ Update `VITE_AUTH_API_URL` nếu có backend riêng

### 3. vite.config.js
- ✅ Code splitting (Vue, UI, HTTP vendors riêng)
- ✅ Minification với Terser
- ✅ No sourcemap (giảm size)

## 📊 Build Size Optimization

Sau khi build, check size:
```bash
npm run build
# dist/assets/vue-vendor.*.js - Vue core
# dist/assets/ui-vendor.*.js - Lucide icons
# dist/assets/http-vendor.*.js - Axios
# dist/assets/index.*.js - App code
```

## 🔒 Environment Variables Trên Vercel

Nếu cần thêm biến môi trường:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Thêm biến có prefix `VITE_`
3. Chọn: Production ✅, Preview ✅, Development ✅
4. Save → Redeploy

## 🌐 Sau Khi Deploy

1. ✅ Test tất cả pages
2. ✅ Test refresh page (deep links)
3. ✅ Test responsive mobile
4. ✅ Check Console (F12) - không có errors
5. ✅ Test Lighthouse score

## 🎯 URLs

- **Production**: https://your-app.vercel.app
- **Preview**: Tự động tạo khi push branch khác
- **Custom Domain**: Settings → Domains

## 💡 Auto Deploy

Vercel tự động deploy khi:
- Push to `main` → Production
- Push to other branches → Preview
- Pull Request → Preview URL

## 🆘 Troubleshooting

**404 khi refresh page?**
→ Check vercel.json có routes config ✅

**Build failed?**
→ Run `npm run build` locally để debug

**Env vars không hoạt động?**
→ Đảm bảo có prefix `VITE_` và đã redeploy

## 📚 Docs

- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev)
- [Vue Router on Vercel](https://vercel.com/guides/deploying-vue-with-vercel)
