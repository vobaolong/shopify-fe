import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

export const clientImg = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json'
  }
})

client.interceptors.request.use(
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

clientImg.interceptors.request.use(
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

client.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.data) {
      const errorMessage =
        error.response.data.error || error.response.data.message
      if (errorMessage) {
        error.message = errorMessage
      }
    }
    return Promise.reject(error)
  }
)

clientImg.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.data) {
      const errorMessage =
        error.response.data.error || error.response.data.message
      if (errorMessage) {
        error.message = errorMessage
      }
    }

    return Promise.reject(error)
  }
)

export default client
