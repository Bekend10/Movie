// Mock data for development and testing

export const mockMovies = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400',
    backdrop: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200',
    rating: 9.3,
    year: 1994,
    duration: '2h 22m',
    genres: ['Drama', 'Crime'],
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
  },
  {
    id: 2,
    title: 'The Godfather',
    poster: 'https://images.unsplash.com/photo-1618945524163-32451704cbb8?w=400',
    backdrop: 'https://images.unsplash.com/photo-1618945524163-32451704cbb8?w=1200',
    rating: 9.2,
    year: 1972,
    duration: '2h 55m',
    genres: ['Crime', 'Drama'],
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
  },
  {
    id: 3,
    title: 'The Dark Knight',
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400',
    backdrop: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200',
    rating: 9.0,
    year: 2008,
    duration: '2h 32m',
    genres: ['Action', 'Crime', 'Drama'],
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.'
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200',
    rating: 8.9,
    year: 1994,
    duration: '2h 34m',
    genres: ['Crime', 'Drama'],
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.'
  },
  {
    id: 5,
    title: 'Forrest Gump',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200',
    rating: 8.8,
    year: 1994,
    duration: '2h 22m',
    genres: ['Drama', 'Romance'],
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.'
  },
  {
    id: 6,
    title: 'Inception',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200',
    rating: 8.8,
    year: 2010,
    duration: '2h 28m',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.'
  },
  {
    id: 7,
    title: 'The Matrix',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
    backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200',
    rating: 8.7,
    year: 1999,
    duration: '2h 16m',
    genres: ['Action', 'Sci-Fi'],
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
  },
  {
    id: 8,
    title: 'Interstellar',
    poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
    backdrop: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200',
    rating: 8.6,
    year: 2014,
    duration: '2h 49m',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
  }
]

export const mockGenres = [
  { id: 1, name: 'Hành Động', icon: '🎭' },
  { id: 2, name: 'Hài Hước', icon: '😂' },
  { id: 3, name: 'Tâm Lý', icon: '💭' },
  { id: 4, name: 'Kinh Dị', icon: '👻' },
  { id: 5, name: 'Khoa Học Viễn Tưởng', icon: '🚀' },
  { id: 6, name: 'Hoạt Hình', icon: '🎨' },
  { id: 7, name: 'Tình Cảm', icon: '❤️' },
  { id: 8, name: 'Phiêu Lưu', icon: '🗺️' }
]

export const mockUser = {
  id: 'user_001',
  email: 'nguyenvana@example.com',
  username: 'nguyenvana',
  fullName: 'Nguyễn Văn A',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  phone: '+84 912 345 678',
  dateOfBirth: '1995-05-15',
  gender: 'male',
  address: {
    street: '123 Đường Lê Lợi',
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    country: 'Việt Nam'
  },
  subscription: {
    plan: 'Premium',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    price: '180,000đ/tháng'
  },
  preferences: {
    language: 'vi',
    quality: '1080p',
    autoplay: true,
    notifications: true,
    favoriteGenres: ['Hành Động', 'Khoa Học Viễn Tưởng', 'Phiêu Lưu']
  },
  stats: {
    totalWatched: 156,
    totalHours: 342,
    favoriteMovies: 23,
    reviewsWritten: 12,
    memberSince: '2022-03-20'
  },
  recentActivity: [
    {
      type: 'watched',
      movie: 'Inception',
      date: '2024-02-20',
      progress: 100
    },
    {
      type: 'added',
      movie: 'The Matrix',
      date: '2024-02-19',
      progress: 0
    },
    {
      type: 'watched',
      movie: 'Interstellar',
      date: '2024-02-18',
      progress: 45
    }
  ],
  watchHistory: [
    { movieId: 6, title: 'Inception', watchedAt: '2024-02-20', duration: '2h 28m' },
    { movieId: 8, title: 'Interstellar', watchedAt: '2024-02-18', duration: '2h 49m' },
    { movieId: 3, title: 'The Dark Knight', watchedAt: '2024-02-15', duration: '2h 32m' },
    { movieId: 7, title: 'The Matrix', watchedAt: '2024-02-12', duration: '2h 16m' },
    { movieId: 5, title: 'Forrest Gump', watchedAt: '2024-02-10', duration: '2h 22m' }
  ]
}

// Function to generate multiple copies of movies for testing
export const generateMockMovies = (count = 20) => {
  const movies = []
  for (let i = 0; i < count; i++) {
    const movie = mockMovies[i % mockMovies.length]
    movies.push({
      ...movie,
      id: i + 1,
      title: `${movie.title} ${i + 1}`
    })
  }
  return movies
}

export default {
  mockMovies,
  mockGenres,
  mockUser,
  generateMockMovies
}
