import { useQuery, useMutation } from '@tanstack/react-query'
import {
  addWishlist,
  unWishlist,
  getWishlistCount,
  checkWishlist,
  listWishlist
} from '../apis/wishlist.api'
import useInvalidate from './useInvalidate'

export const wishlistKeys = {
  all: ['favorites'],
  product: {
    all: () => [...wishlistKeys.all, 'product'],
    count: (productId: string) => [
      ...wishlistKeys.product.all(),
      'count',
      productId
    ],
    isWishlist: (userId: string, productId: string) => [
      ...wishlistKeys.product.all(),
      'isWishlist',
      userId,
      productId
    ],
    listWishlist: (userId: string, filters: any) => [
      ...wishlistKeys.product.all(),
      'listWishlist',
      userId,
      { filters }
    ]
  },
  store: {
    all: () => [...wishlistKeys.all, 'store'],
    count: (storeId: string) => [...wishlistKeys.store.all(), 'count', storeId],
    isFavorite: (userId: string, storeId: string) => [
      ...wishlistKeys.store.all(),
      'isFavorite',
      userId,
      storeId
    ]
  }
}

export const useAddWishlistCount = (productId: string) => {
  return useQuery({
    queryKey: wishlistKeys.product.count(productId),
    queryFn: () => getWishlistCount(productId),
    select: (data: any) => data?.count || 0,
    enabled: !!productId
  })
}

export const useIsWishlist = (userId: string, productId: string) => {
  return useQuery({
    queryKey: wishlistKeys.product.isWishlist(userId, productId),
    queryFn: () => checkWishlist(userId, productId),
    select: (data: any) => !!data?.success,
    enabled: !!userId && !!productId
  })
}

export const useListWishlist = (userId: string, filters: any) => {
  return useQuery({
    queryKey: wishlistKeys.product.listWishlist(userId, filters),
    queryFn: () => listWishlist(userId, filters),
    enabled: !!userId
  })
}

export const useAddWishlist = () => {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({
      userId,
      productId
    }: {
      userId: string
      productId: string
    }) => addWishlist(userId, productId),
    onSuccess: (_, variables) => {
      invalidate({
        queryKey: wishlistKeys.product.count(variables.productId)
      })
      invalidate({
        queryKey: wishlistKeys.product.isWishlist(
          variables.userId,
          variables.productId
        )
      })
      invalidate({
        queryKey: wishlistKeys.product.all()
      })
    }
  })
}

export const useUnWishlist = () => {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({
      userId,
      productId
    }: {
      userId: string
      productId: string
    }) => unWishlist(userId, productId),
    onSuccess: (_, variables) => {
      invalidate({
        queryKey: wishlistKeys.product.count(variables.productId)
      })
      invalidate({
        queryKey: wishlistKeys.product.isWishlist(
          variables.userId,
          variables.productId
        )
      })
      invalidate({
        queryKey: wishlistKeys.product.all()
      })
    }
  })
}
export const useToggleWishlist = () => {
  const wishlistMutation = useAddWishlist()
  const unWishlistMutation = useUnWishlist()
  const isPending = wishlistMutation.isPending || unWishlistMutation.isPending

  const toggleWishlist = (
    userId: string,
    productId: string,
    isCurrentlyWishlist: boolean
  ) => {
    if (isCurrentlyWishlist) {
      return unWishlistMutation.mutateAsync({ userId, productId })
    } else {
      return wishlistMutation.mutateAsync({ userId, productId })
    }
  }
  return { toggleWishlist, isPending }
}
