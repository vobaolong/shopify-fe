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

axiosClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('jwt') || '{}')
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
    const user = JSON.parse(localStorage.getItem('jwt') || '{}')
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API error:', error)
    return Promise.reject(error)
  }
)

export default axiosClient
