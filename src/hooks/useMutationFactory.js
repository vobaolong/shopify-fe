import { useMutation } from '@tanstack/react-query'
import useInvalidate from './useInvalidate'

/**
 * A higher-order hook factory for creating mutation hooks with auto-invalidation
 * @param {Function} mutationFn - The mutation function to be called
 * @param {Function} getInvalidateFilters - Function that returns an array of query filters to invalidate
 * @param {Object} options - Additional mutation options
 * @returns {Object} A configured mutation hook
 *
 * @example
 * // Simple example
 * const useAddProduct = createMutationHook(
 *   ({ productData }) => addProduct(productData),
 *   (data, variables) => [
 *     { queryKey: ['products'] },
 *     { queryKey: ['categories', variables.productData.categoryId] }
 *   ]
 * );
 *
 * // Usage in components
 * const { mutate, isLoading } = useAddProduct();
 * const handleAddProduct = () => mutate({ productData: newProduct });
 */
export function createMutationHook(
  mutationFn,
  getInvalidateFilters,
  options = {}
) {
  return function useCustomMutation() {
    const invalidate = useInvalidate()

    return useMutation({
      mutationFn,
      ...options,
      onSuccess: (data, variables, context) => {
        // Invalidate all specified query filters
        const filters = getInvalidateFilters(data, variables, context)

        if (Array.isArray(filters)) {
          filters.forEach((filter) => invalidate(filter))
        }

        // Call the original onSuccess if provided
        if (options.onSuccess) {
          options.onSuccess(data, variables, context)
        }
      }
    })
  }
}
