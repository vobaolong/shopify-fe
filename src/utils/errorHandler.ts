import { AxiosError } from 'axios'

interface ApiError extends Error {
  status?: number
  response?: {
    status: number
    data?: any
  }
}

interface NotificationInstance {
  error: (config: any) => void
  warning: (config: any) => void
  info: (config: any) => void
}

const showError = (
  notification: NotificationInstance,
  message: string,
  type: 'error' | 'warning' | 'info' = 'error',
  duration: number = 6
) => {
  notification[type]({
    message:
      type === 'error'
        ? 'Error'
        : type === 'warning'
          ? 'Warning'
          : 'Information',
    description: message,
    duration,
    placement: 'topRight',
    style: { width: 400 }
  })
}

export const handleQueryError = (
  error: Error,
  notification: NotificationInstance
) => {
  if (error instanceof AxiosError) {
    const status = error.status || error.response?.status

    // Only log serious errors
    if (!status || status >= 500) {
      console.error('TanStack Query Error:', error)
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`API Error ${status}:`, error.message)
    }

    if (status) {
      switch (status) {
        case 401:
          showError(
            notification,
            'Session expired. Please log in again.',
            'warning'
          )
          break
        case 403:
          showError(
            notification,
            'You do not have permission to access this resource.',
            'warning'
          )
          break
        case 404:
          // Silent for 404 - just log in dev
          if (process.env.NODE_ENV === 'development') {
            console.info('Resource not found (404):', error.message)
          }
          break
        case 429:
          showError(
            notification,
            'Too many requests. Please try again later.',
            'warning'
          )
          break
        case 500:
          showError(
            notification,
            'Server error. Please try again later.',
            'error'
          )
          break
        case 502:
        case 503:
        case 504:
          showError(
            notification,
            'Service temporarily unavailable. Please try again later.',
            'error'
          )
          break
        default:
          if (status >= 400 && status < 500) {
            showError(
              notification,
              'Client error. Please check your request and try again.',
              'warning'
            )
          } else if (status >= 500) {
            showError(
              notification,
              'Server error. Please try again later.',
              'error'
            )
          }
      }
    } else {
      // Network errors
      if (
        error.code === 'NETWORK_ERROR' ||
        error.message.includes('Network Error')
      ) {
        showError(
          notification,
          'Network error. Please check your connection and try again.',
          'error'
        )
      } else if (
        error.code === 'ECONNABORTED' ||
        error.message.includes('timeout')
      ) {
        showError(notification, 'Request timeout. Please try again.', 'error')
      } else {
        showError(notification, 'Connection error. Please try again.', 'error')
      }
    }
  } else {
    showError(
      notification,
      'An unexpected error occurred. Please try again.',
      'error'
    )
  }
}

export const shouldRetry = (
  failureCount: number,
  error: unknown,
  maxRetries: number = 3
) => {
  if (error instanceof AxiosError) {
    const status = error.status || error.response?.status
    // Don't retry 4xx errors
    if (status && status >= 400 && status < 500) {
      return false
    }
  }
  return failureCount < maxRetries
}
