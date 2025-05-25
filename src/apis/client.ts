import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

export const axiosClientImg = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json'
  }
})

// Request interceptor - Thêm token vào header của mỗi request
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('jwt') || '{}')

    // Nếu có accessToken thì thêm vào header Authorization
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosClientImg.interceptors.request.use(
  (config) => {
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('jwt') || '{}')

    // Nếu có accessToken thì thêm vào header Authorization
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Xử lý response và error
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ trả về data từ response
    return response.data
  },
  (error) => {
    // Log lỗi và reject promise
    console.error('API error:', error)
    return Promise.reject(error)
  }
)

export default axiosClient
