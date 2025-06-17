import React, { useEffect, useMemo } from 'react'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { handleQueryError, shouldRetry } from '../utils/errorHandler'
import { useAntdApp } from '../hooks/useAntdApp'

// Global error handler hook
function useGlobalErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      event.preventDefault()
    }

    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleGlobalError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleGlobalError)
    }
  }, [])
}

function GlobalErrorHandlerWrapper({
  children
}: {
  children: React.ReactNode
}) {
  useGlobalErrorHandler()
  return <>{children}</>
}

// Inner provider that has access to notification context
function QueryClientProviderInner({ children }: { children: React.ReactNode }) {
  const { notification } = useAntdApp()

  // Create query client with notification context
  const queryClient = useMemo(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => handleQueryError(error as Error, notification)
      }),
      mutationCache: new MutationCache({
        onError: (error) => handleQueryError(error as Error, notification)
      }),
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          refetchOnReconnect: true,
          retry: (failureCount, error) => shouldRetry(failureCount, error, 3),
          retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 30000)
        },
        mutations: {
          retry: (failureCount, error) => shouldRetry(failureCount, error, 2),
          retryDelay: 1000
        }
      }
    })
  }, [notification])

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorHandlerWrapper>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} position='bottom' />
        )}
      </GlobalErrorHandlerWrapper>
    </QueryClientProvider>
  )
}

export default function ReactQueryProvider({
  children
}: {
  children: React.ReactNode
}) {
  return <QueryClientProviderInner>{children}</QueryClientProviderInner>
}
