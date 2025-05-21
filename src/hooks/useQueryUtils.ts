import { QueryClient } from '@tanstack/react-query'

/**
 * A utility function to inspect the current TanStack Query cache
 * Useful for debugging or analytics purposes
 */
export const getQueryCache = () => {
  const queryClient = new QueryClient()
  return queryClient.getQueryCache().getAll()
}

/**
 * Returns the current state of a specific query
 * @param {Array} queryKey - The query key to look for
 */
export const getQueryState = (queryKey) => {
  const queryClient = new QueryClient()
  return queryClient.getQueryState(queryKey)
}

/**
 * Invalidates multiple query keys at once
 * @param {Array} queryKeys - Array of query keys to invalidate
 */
export const invalidateMultipleQueries = (queryKeys) => {
  const queryClient = new QueryClient()

  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: key })
  })
}

/**
 * Prefetches data for multiple query keys
 * Useful for preloading data before routing to a new page
 * @param {Array} queryConfigs - Array of objects with queryKey and queryFn
 */
export const prefetchMultipleQueries = async (queryConfigs) => {
  const queryClient = new QueryClient()

  const promises = queryConfigs.map((config) => {
    return queryClient.prefetchQuery({
      queryKey: config.queryKey,
      queryFn: config.queryFn,
      staleTime: config.staleTime || 5 * 60 * 1000 // default 5 minutes
    })
  })

  return Promise.all(promises)
}

/**
 * Sets the query data manually
 * Useful for optimistic updates
 * @param {Array} queryKey - The query key to update
 * @param {*} data - The data to set
 */
export const setQueryData = (queryKey, data) => {
  const queryClient = new QueryClient()
  queryClient.setQueryData(queryKey, data)
}

/**
 * Reset all queries in the cache
 */
export const resetQueryCache = () => {
  const queryClient = new QueryClient()
  queryClient.resetQueries()
}
