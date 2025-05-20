import { useQuery } from '@tanstack/react-query'
import {
  listReviews,
  checkReview,
  reviewProduct,
  updateReview,
  deleteReview,
  restoreReview
} from '../apis/review'
import { createMutationHook } from './useMutationFactory'

// Query keys
export const reviewKeys = {
  all: ['reviews'],
  lists: () => [...reviewKeys.all, 'list'],
  list: (filters) => [...reviewKeys.lists(), { filters }],
  checks: () => [...reviewKeys.all, 'check'],
  check: (data) => [...reviewKeys.checks(), { data }]
}

// Hooks
export const useReviews = (filters) => {
  return useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: () => listReviews(filters)
  })
}

export const useCheckReview = (userId, data) => {
  return useQuery({
    queryKey: reviewKeys.check(data),
    queryFn: () => checkReview(userId, data),
    enabled: !!userId && !!data
  })
}

export const useReviewProduct = createMutationHook(
  ({ userId, review }) => reviewProduct(userId, review),
  (data, variables) => {
    const filters = [{ queryKey: reviewKeys.lists() }]

    if (variables.review && variables.review.productId) {
      filters.push({
        queryKey: ['products', 'detail', variables.review.productId]
      })
    }

    return filters
  }
)

export const useUpdateReview = createMutationHook(
  ({ userId, reviewId, review }) => updateReview(userId, reviewId, review),
  (data, variables) => {
    const filters = [{ queryKey: reviewKeys.lists() }]

    if (variables.review && variables.review.productId) {
      filters.push({
        queryKey: ['products', 'detail', variables.review.productId]
      })
    }

    return filters
  }
)

export const usedeleteReview = createMutationHook(
  ({ userId, reviewId }) => deleteReview(userId, reviewId),
  () => [{ queryKey: reviewKeys.lists() }]
)

export const useRestoreReview = createMutationHook(
  ({ userId, reviewId }) => restoreReview(userId, reviewId),
  () => [{ queryKey: reviewKeys.lists() }]
)
