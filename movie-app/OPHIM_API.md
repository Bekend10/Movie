# Tài liệu OPhim API Integration

## Thông tin cơ bản

- **Base URL**: `https://ophim1.com`
- **Định dạng dữ liệu**: JSON
- **Mã hóa**: UTF-8
- **Phương thức HTTP**: GET
- **Tài liệu chính thức**: https://ophim17.cc/api-document

## Các API Endpoints đã tích hợp

### 1. API Trang chủ
```javascript
GET /v1/api/home?page=1
```
**Sử dụng:**
```javascript
import movieService from '@/services/movieService'
const result = await movieService.getHome(page)
```

**Response:**
```json
{
  "status": "success",
  "message": "Lấy dữ liệu thành công",
  "data": {
    "seoOnPage": {
      "titleHead": "Xem phim online miễn phí",
      "descriptionHead": "Xem phim online chất lượng cao miễn phí"
    },
    "items": [...],
    "params": {
      "pagination": {
        "currentPage": 1,
        "totalItems": 100,
        "totalItemsPerPage": 24
      }
    },
    "APP_DOMAIN_CDN_IMAGE": "https://img.ophim.cc/uploads/movies/",
    "APP_DOMAIN_FRONTEND": "https://ophim1.com"
  }
}
```

### 2. API Danh sách phim theo bộ lọc
```javascript
GET /v1/api/danh-sach/[slug]?page=1&limit=24&sort_field=modified.time&sort_type=desc
```

**Slug options:**
- `phim-bo` - Phim bộ
- `phim-le` - Phim lẻ
- `tv-shows` - TV Shows
- `hoat-hinh` - Hoạt hình
- `phim-vietsub` - Phim Vietsub
- `phim-thuyet-minh` - Phim thuyết minh
- `phim-long-tien` - Phim lồng tiếng
- `phim-bo-dang-chieu` - Phim bộ đang chiếu
- `phim-bo-hoan-thanh` - Phim bộ hoàn thành
- `phim-sap-chieu` - Phim sắp chiếu
- `subteam` - Subteam
- `phim-chieu-rap` - Phim chiếu rạp

**Parameters:**
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số phim/trang (default: 24)
- `sort_field` (optional): `modified.time`, `year`, `_id`
- `sort_type` (optional): `desc`, `asc`
- `category` (optional): Lọc theo thể loại (comma-separated slugs)
- `country` (optional): Lọc theo quốc gia (comma-separated slugs)
- `year` (optional): Lọc theo năm

**Sử dụng:**
```javascript
// Lấy phim lẻ
const result = await movieService.getMoviesList('phim-le', { page: 1, limit: 24 })

// Hoặc sử dụng alias
const trending = await movieService.getTrending(1)
const series = await movieService.getMoviesByType('phim-bo', 1)

// Với filters
const filtered = await movieService.getMoviesList('phim-le', {
  page: 1,
  category: 'hanh-dong,tinh-cam',
  country: 'han-quoc',
  year: '2024'
})
```

**Response:**
```json
{
  "status": "success",
  "message": "Lấy dữ liệu thành công",
  "data": {
    "seoOnPage": {...},
    "titlePage": "Phim mới",
    "breadCrumb": [...],
    "items": [...],
    "params": {
      "pagination": {
        "currentPage": 1,
        "totalItems": 100,
        "totalItemsPerPage": 24,
        "totalPages": 5
      }
    }
  }
}
```

### 3. API Tìm kiếm
```javascript
GET /v1/api/tim-kiem?keyword=[keyword]&page=1
```

**Sử dụng:**
```javascript
const results = await movieService.search('avengers', 1)
```

**Response:**
```json
{
  "status": "success",
  "message": "Tìm kiếm thành công",
  "data": {
    "seoOnPage": {...},
    "titlePage": "Tìm kiếm: avengers",
    "breadCrumb": [...],
    "items": [...],
    "params": {
      "keyword": "avengers",
      "pagination": {...}
    }
  }
}
```

### 4. API Danh sách thể loại
```javascript
GET /v1/api/the-loai
```

**Sử dụng:**
```javascript
const genres = await movieService.getGenres()
```

**Response:**
```json
{
  "status": "success",
  "data": [
    { "_id": "...", "slug": "hanh-dong", "name": "Hành động" },
    { "_id": "...", "slug": "tinh-cam", "name": "Tình cảm" }
  ]
}
```

### 5. API Lọc theo thể loại
```javascript
GET /v1/api/the-loai/[slug]?page=1&limit=24&sort_field=modified.time&sort_type=desc
```

**Parameters:**
- `page` (optional): Số trang
- `limit` (optional): Số phim/trang
- `sort_field` (optional): `modified.time`, `year`, `_id`
- `sort_type` (optional): `desc`, `asc`
- `country` (optional): Lọc theo quốc gia
- `year` (optional): Lọc theo năm

**Sử dụng:**
```javascript
const actionMovies = await movieService.getMoviesByGenre('hanh-dong', {
  page: 1,
  country: 'han-quoc',
  year: '2024'
})
```

### 6. API Danh sách quốc gia
```javascript
GET /v1/api/quoc-gia
```

**Sử dụng:**
```javascript
const countries = await movieService.getCountries()
```

**Response:**
```json
{
  "status": "success",
  "data": [
    { "_id": "...", "slug": "han-quoc", "name": "Hàn Quốc" },
    { "_id": "...", "slug": "trung-quoc", "name": "Trung Quốc" }
  ]
}
```

### 7. API Lọc theo quốc gia
```javascript
GET /v1/api/quoc-gia/[slug]?page=1&limit=24&sort_field=modified.time&sort_type=desc
```

**Parameters:**
- `page` (optional): Số trang
- `limit` (optional): Số phim/trang
- `sort_field` (optional): `modified.time`, `year`, `_id`
- `sort_type` (optional): `desc`, `asc`
- `year` (optional): Lọc theo năm

**Sử dụng:**
```javascript
const koreanMovies = await movieService.getMoviesByCountry('han-quoc', {
  page: 1,
  year: '2024'
})
```

### 8. API Danh sách năm phát hành
```javascript
GET /v1/api/nam-phat-hanh
```

**Sử dụng:**
```javascript
const years = await movieService.getYears()
```

**Response:**
```json
{
  "status": "success",
  "data": [
    { "_id": "...", "slug": "2025", "name": "2025" },
    { "_id": "...", "slug": "2024", "name": "2024" }
  ]
}
```

### 9. API Lọc theo năm phát hành
```javascript
GET /v1/api/nam-phat-hanh/[year]?page=1&limit=24&sort_field=modified.time&sort_type=desc
```

**Parameters:**
- `page` (optional): Số trang
- `limit` (optional): Số phim/trang
- `sort_field` (optional): `modified.time`, `year`, `_id`
- `sort_type` (optional): `desc`, `asc`
- `category` (optional): Lọc theo thể loại
- `country` (optional): Lọc theo quốc gia

**Sử dụng:**
```javascript
const movies2024 = await movieService.getMoviesByYear('2024', {
  page: 1,
  category: 'hanh-dong',
  country: 'han-quoc'
})
```

### 10. API Chi tiết phim
```javascript
GET /v1/api/phim/[slug]
```

**Sử dụng:**
```javascript
const movie = await movieService.getMovieDetail('linh-moi-phan-8')

// Extract image URLs
const cdnDomain = movie.data.APP_DOMAIN_CDN_IMAGE
const schemaImage = movie.data.seoOnPage.seoSchema.image
const thumbUrl = `${cdnDomain}/uploads/movies/${movie.data.item.thumb_url}`
const posterUrl = `${cdnDomain}/uploads/movies/${movie.data.item.poster_url}`

// Or use helper function
import { getOPhimImageUrl } from '../composables/useImageUtils'
const thumbUrl = getOPhimImageUrl(movie.data.item.thumb_url, cdnDomain)
```

**Response:**
```json
{
  "status": "success",
  "message": "",
  "data": {
    "seoOnPage": {
      "og_type": "video.movie",
      "titleHead": "Lính Mới (Phần 8)-The Rookie (Season 8) (2026) [HD-Vietsub]",
      "seoSchema": {
        "@context": "https://schema.org",
        "@type": "TvSeries",
        "name": "Lính Mới (Phần 8)",
        "image": "https://img.ophim.live/uploads/movies/linh-moi-phan-8-thumb.jpg",
        "url": "https://ophim17.cc/phim/linh-moi-phan-8"
      },
      "og_image": [
        "movies/linh-moi-phan-8-thumb.jpg"
      ]
    },
    "breadCrumb": [...],
    "item": {
      "_id": "...",
      "name": "Lính Mới (Phần 8)",
      "slug": "linh-moi-phan-8",
      "origin_name": "The Rookie (Season 8)",
      "content": "Mô tả phim...",
      "type": "series",
      "status": "ongoing",
      "thumb_url": "linh-moi-phan-8-thumb.jpg",
      "poster_url": "linh-moi-phan-8-poster.jpg",
      "trailer_url": "https://youtube.com/...",
      "time": "43 phút/tập",
      "episode_current": "Tập 8",
      "episode_total": "18 Tập",
      "quality": "HD",
      "lang": "Vietsub",
      "year": 2026,
      "view": 0,
      "actor": ["Nathan Fillion", "Melissa O'Neil"],
      "director": [""],
      "category": [
        {
          "id": "...",
          "name": "Hài Hước",
          "slug": "hai-huoc"
        }
      ],
      "country": [
        {
          "id": "...",
          "name": "Âu Mỹ",
          "slug": "au-my"
        }
      ],
      "episodes": [
        {
          "server_name": "Subteam #1",
          "server_data": [
            {
              "name": "1",
              "slug": "1",
              "filename": "...",
              "link_embed": "https://...",
              "link_m3u8": "https://..."
            }
          ]
        }
      ],
      "tmdb": {
        "type": "tv",
        "id": "79744",
        "season": 8,
        "vote_average": 8.529,
        "vote_count": 2930
      },
      "imdb": {
        "id": "tt7587890",
        "vote_average": 8,
        "vote_count": 116400
      }
    },
    "APP_DOMAIN_CDN_IMAGE": "https://img.ophim.live"
  }
}
```

**Image URLs:**
- `seoOnPage.seoSchema.image` - Full URL của thumbnail (recommended)
- `APP_DOMAIN_CDN_IMAGE` - CDN domain để construct image URLs
- `item.thumb_url` - Relative path của thumbnail
- `item.poster_url` - Relative path của poster

**Construct image URLs:**
```javascript
// Method 1: Use schema image (full URL)
const imageUrl = response.data.seoOnPage.seoSchema.image

// Method 2: Construct from CDN + relative path
const cdnDomain = response.data.APP_DOMAIN_CDN_IMAGE
const thumbUrl = `${cdnDomain}/uploads/movies/${response.data.item.thumb_url}`
const posterUrl = `${cdnDomain}/uploads/movies/${response.data.item.poster_url}`

// Method 3: Use helper function
import { getOPhimImageUrl } from '../composables/useImageUtils'
const thumbUrl = getOPhimImageUrl(response.data.item.thumb_url, cdnDomain)
```


### 11. API Hình ảnh phim (TMDB Images)
```javascript
GET /v1/api/phim/[slug]/images
```

**Sử dụng:**
```javascript
const images = await movieService.getMovieImages('tro-choi-con-muc')

// Xử lý images với helper function
import { processTMDBImages } from '../composables/useImageUtils'

// Lấy 12 backdrop images
const backdropImages = processTMDBImages(images.data, {
  type: 'backdrop',
  limit: 12,
  size: 'original'  // hoặc 'w1280', 'w780'
})

// Lấy 6 poster images
const posterImages = processTMDBImages(images.data, {
  type: 'poster',
  limit: 6,
  size: 'w500'
})
```

**Response:**
```json
{
  "success": true,
  "message": "success",
  "status_code": 200,
  "data": {
    "tmdb_id": 93405,
    "slug": "tro-choi-con-muc",
    "image_sizes": {
      "backdrop": {
        "original": "https://image.tmdb.org/t/p/original",
        "w1280": "https://image.tmdb.org/t/p/w1280",
        "w780": "https://image.tmdb.org/t/p/w780",
        "w300": "https://image.tmdb.org/t/p/w300"
      },
      "poster": {
        "original": "https://image.tmdb.org/t/p/original",
        "w780": "https://image.tmdb.org/t/p/w780",
        "w500": "https://image.tmdb.org/t/p/w500",
        "w342": "https://image.tmdb.org/t/p/w342",
        "w185": "https://image.tmdb.org/t/p/w185",
        "w154": "https://image.tmdb.org/t/p/w154",
        "w92": "https://image.tmdb.org/t/p/w92"
      }
    },
    "images": [
      {
        "width": 1920,
        "height": 1080,
        "aspect_ratio": 1.778,
        "type": "backdrop",
        "file_path": "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg"
      },
      {
        "width": 2000,
        "height": 3000,
        "aspect_ratio": 0.667,
        "type": "poster",
        "file_path": "/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
        "iso_639_1": "en"
      }
    ]
  }
}
```

**Cách xử lý images:**
1. Lấy base URL từ `image_sizes[type][size]`
2. Ghép với `file_path` từ mảng `images`
3. Ví dụ: `https://image.tmdb.org/t/p/original` + `/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg`

**Helper Functions:**
```javascript
// Sử dụng processTMDBImages
import { processTMDBImages, getTMDBImageUrl } from '../composables/useImageUtils'

// Automatic processing
const images = processTMDBImages(responseData, {
  type: 'backdrop',  // 'backdrop' or 'poster'
  limit: 12,         // số lượng images
  size: 'original'   // 'original', 'w1280', 'w780', etc.
})

// Manual processing
const imageUrl = getTMDBImageUrl('/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg', 'original', 'backdrop')
```


### 12. API Thông tin diễn viên
```javascript
GET /v1/api/phim/[slug]/peoples
```

**Sử dụng:**
```javascript
const cast = await movieService.getMoviePeoples('tro-choi-con-muc')
// Hoặc alias
const cast = await movieService.getMovieCast('tro-choi-con-muc')
```

**Response:**
```json
{
  "success": true,
  "message": "Lấy dữ liệu thành công",
  "data": {
    "tmdb_id": 93405,
    "slug": "tro-choi-con-muc",
    "profile_sizes": {
      "h632": "h632",
      "original": "original",
      "w185": "w185"
    },
    "peoples": [
      {
        "tmdb_people_id": 1586137,
        "name": "Lee Jung-jae",
        "character": "Seong Gi-hun",
        "known_for_department": "Acting",
        "profile_path": "/..."
      }
    ]
  }
}
```

### 13. API Từ khóa phim
```javascript
GET /v1/api/phim/[slug]/keywords
```

**Sử dụng:**
```javascript
const keywords = await movieService.getMovieKeywords('tro-choi-con-muc')
```

## Sử dụng trong Store (Pinia)

```javascript
import { useMovieStore } from '@/stores/movieStore'

const movieStore = useMovieStore()

// Lấy trang chủ
const { items, pagination } = await movieStore.fetchTrending(1)

// Lấy phim theo thể loại với filters
const result = await movieStore.fetchMoviesByGenre('hanh-dong', 1, {
  country: 'han-quoc',
  year: '2024',
  sort_field: 'year',
  sort_type: 'desc'
})

// Tìm kiếm phim
const searchResult = await movieStore.searchMovies('avengers', 1)

// Lấy chi tiết phim
const movie = await movieStore.fetchMovieDetail('tro-choi-con-muc')

// Lấy phim tương tự
const similar = await movieStore.fetchSimilarMovies('tro-choi-con-muc')

// Lấy phim theo quốc gia
const korean = await movieStore.fetchMoviesByCountry('han-quoc', 1)

// Lấy phim theo năm
const movies2024 = await movieStore.fetchMoviesByYear('2024', 1)

// Lấy phim theo loại
const series = await movieStore.fetchMoviesByType('phim-bo', 1)

// Lấy danh sách thể loại
const genres = await movieStore.fetchGenres()

// Lấy danh sách quốc gia
const countries = await movieStore.fetchCountries()

// Lấy danh sách năm
const years = await movieStore.fetchYears()
```

## Cấu trúc Response Data

### Movie Item (trong danh sách)
```json
{
  "_id": "66f8e123456789abcdef",
  "name": "Tên phim",
  "slug": "ten-phim",
  "origin_name": "Original Name",
  "alternative_names": ["Tên khác 1"],
  "type": "series|single",
  "thumb_url": "/thumb.jpg",
  "poster_url": "/poster.jpg",
  "year": 2024,
  "category": [
    {
      "id": "action",
      "name": "Hành động",
      "slug": "hanh-dong"
    }
  ],
  "country": [
    {
      "id": "us",
      "name": "Mỹ",
      "slug": "my"
    }
  ]
}
```

## Advanced Filtering Examples

### Kết hợp nhiều bộ lọc
```javascript
// Phim hành động Hàn Quốc năm 2024
const result = await movieService.getMoviesList('phim-le', {
  page: 1,
  limit: 24,
  category: 'hanh-dong',
  country: 'han-quoc',
  year: '2024',
  sort_field: 'year',
  sort_type: 'desc'
})

// Phim bộ đang chiếu thể loại tình cảm
const ongoingSeries = await movieService.getMoviesList('phim-bo-dang-chieu', {
  page: 1,
  category: 'tinh-cam'
})

// Phim lẻ chiếu rạp
const cinemaMovies = await movieService.getMoviesList('phim-chieu-rap', {
  page: 1,
  sort_field: 'year',
  sort_type: 'desc'
})
```

### Lọc theo thể loại với nhiều quốc gia
```javascript
const asianAction = await movieService.getMoviesByGenre('hanh-dong', {
  page: 1,
  country: 'han-quoc,trung-quoc,nhat-ban',
  sort_field: 'modified.time',
  sort_type: 'desc'
})
```

## Xử lý Images và CDN

```javascript
// OPhim API trả về relative path
const APP_DOMAIN_CDN_IMAGE = 'https://img.ophim.cc/uploads/movies/'

function getFullImageUrl(relativePath) {
  if (!relativePath) return ''
  if (relativePath.startsWith('http')) return relativePath
  return `${APP_DOMAIN_CDN_IMAGE}${relativePath}`
}

// Sử dụng
const thumbUrl = getFullImageUrl(movie.thumb_url)
const posterUrl = getFullImageUrl(movie.poster_url)
```

## Video Player Integration

```javascript
const movie = await movieService.getMovieDetail('tro-choi-con-muc')

// Lấy episode đầu tiên
const firstServer = movie.data.item.episodes[0]
const firstEpisode = firstServer.server_data[0]

// Link embed (iframe)
const embedUrl = firstEpisode.link_embed

// Link m3u8 (HLS streaming)
const m3u8Url = firstEpisode.link_m3u8
```

## Xử lý Lỗi

```javascript
try {
  const result = await movieService.getTrending(1)
  if (result.status === 'success') {
    console.log(result.data.items)
  }
} catch (error) {
  console.error('Error:', error.message)
  // Hiển thị thông báo lỗi
}
```

## Lưu ý quan trọng

1. **Response Status**: Luôn kiểm tra `response.status === 'success'` trước khi xử lý data
2. **Pagination**: Tất cả API danh sách đều hỗ trợ phân trang với `currentPage`, `totalPages`, `totalItems`
3. **Slug vs ID**: API sử dụng `slug` thay vì `id` cho các endpoint chi tiết
4. **Image URLs**: URL ảnh có thể là relative path, cần kết hợp với CDN domain
5. **Episode Structure**: Mỗi phim có thể có nhiều server, mỗi server có nhiều episodes
6. **Filtering**: Hỗ trợ lọc theo nhiều tiêu chí (category, country, year) với comma-separated values
7. **Sorting**: Hỗ trợ sắp xếp theo `modified.time`, `year`, hoặc `_id`
8. **SEO Data**: Mọi response đều có `seoOnPage`, `titlePage`, `breadCrumb`

## Testing API

### Sử dụng cURL
```bash
# Test homepage
curl "https://ophim1.com/v1/api/home?page=1"

# Test search
curl "https://ophim1.com/v1/api/tim-kiem?keyword=avengers"

# Test movie detail
curl "https://ophim1.com/v1/api/phim/tro-choi-con-muc"

# Test genre list
curl "https://ophim1.com/v1/api/the-loai"

# Test filter by genre
curl "https://ophim1.com/v1/api/the-loai/hanh-dong?country=han-quoc&page=1"
```

## Changelog

- **2026-02-25 v2**: Cập nhật với endpoints chính xác
  - Sửa endpoint trang chủ: `/v1/api/home`
  - Thêm endpoint danh sách: `/v1/api/danh-sach/[slug]`
  - Thêm API lấy danh sách thể loại: `/v1/api/the-loai`
  - Thêm API lấy danh sách quốc gia: `/v1/api/quoc-gia`
  - Thêm API lấy danh sách năm: `/v1/api/nam-phat-hanh`
  - Thêm API images, peoples, keywords
  - Cập nhật đầy đủ parameters và filters
  - Thêm ví dụ advanced filtering

---

**Status**: ✅ Fully Integrated with OPhim API  
**Version**: 2.0.0  
**Last Updated**: February 25, 2026

🎬 Happy Coding with Real Data! 🎬
