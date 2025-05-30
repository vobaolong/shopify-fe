import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listReviews,
  checkReview,
  reviewProduct,
  updateReview,
  deleteReview,
  restoreReview,
  deleteReviewByAdmin
} from '../apis/review.api'
import useInvalidate from './useInvalidate'

// Query keys
export const reviewKeys = {
  all: ['reviews'],
  lists: () => [...reviewKeys.all, 'list'],
  list: (filters: Record<string, any>) => [...reviewKeys.lists(), { filters }],
  checks: () => [...reviewKeys.all, 'check'],
  check: (data: Record<string, any>) => [...reviewKeys.checks(), { data }]
}

// Hooks
export const useReviews = (filters: any) => {
  return useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: () => listReviews(filters)
  })
}

export const useCheckReview = (userId: string, data: any) => {
  return useQuery({
    queryKey: reviewKeys.check(data),
    queryFn: () => checkReview(userId, data),
    enabled: !!userId && !!data
  })
}

export const useReviewProduct = () => {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ userId, review }: { userId: string; review: any }) =>
      reviewProduct(userId, review),
    onSuccess: (data: any, variables: { userId: string; review: any }) => {
      const filters = [{ queryKey: reviewKeys.lists() }]
      if (variables.review && variables.review.productId) {
        filters.push({
          queryKey: ['products', 'detail', variables.review.productId]
        })
      }
      filters.forEach((f) => invalidate(f))
    }
  })
}

export const useUpdateReview = () => {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({
      userId,
      reviewId,
      review
    }: {
      userId: string
      reviewId: string
      review: any
    }) => updateReview(userId, reviewId, review),
    onSuccess: (
      data: any,
      variables: { userId: string; reviewId: string; review: any }
    ) => {
      const filters = [{ queryKey: reviewKeys.lists() }]
      if (variables.review && variables.review.productId) {
        filters.push({
          queryKey: ['products', 'detail', variables.review.productId]
        })
      }
      filters.forEach((f) => invalidate(f))
    }
  })
}

export const useDeleteReview = () => {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ userId, reviewId }: { userId: string; reviewId: string }) =>
      deleteReview(userId, reviewId),
    onSuccess: () => {
      invalidate({ queryKey: reviewKeys.lists() })
    }
  })
}

export const useDeleteReviewByAdmin = () => {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) =>
      deleteReviewByAdmin(reviewId),
    onSuccess: () => {
      invalidate({ queryKey: reviewKeys.lists() })
    }
  })
}

export const useRestoreReview = () => {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ userId, reviewId }: { userId: string; reviewId: string }) =>
      restoreReview(userId, reviewId),
    onSuccess: () => {
      invalidate({ queryKey: reviewKeys.lists() })
    }
  })
}
