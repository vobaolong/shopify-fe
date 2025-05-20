import { useQueryClient } from '@tanstack/react-query'

/**
 * A custom hook for invalidating queries
 * @returns {Function} Function to invalidate queries based on provided filters
 * @example
 * const invalidate = useInvalidate();
 * invalidate({ queryKey: ['products'] }); // Invalidate all products queries
 * invalidate({ queryKey: ['products', 'detail', productId] }); // Invalidate specific product
 */
export default function useInvalidate() {
  const queryClient = useQueryClient()
  return (filters) => queryClient.invalidateQueries(filters)
}
