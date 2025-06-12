import { useQuery, useMutation } from '@tanstack/react-query'
import {
  wishlist,
  unWishlist,
  getWishlistCount,
  checkWishlist,
  listWishlist
} from '../apis/wishlist.api'
import useInvalidate from './useInvalidate'

// Query keys
export const favoriteKeys = {
  all: ['favorites'],
  product: {
    all: () => [...favoriteKeys.all, 'product'],
    count: (productId: string) => [
      ...favoriteKeys.product.all(),
      'count',
      productId
    ],
    isFavorite: (userId: string, productId: string) => [
      ...favoriteKeys.product.all(),
      'isFavorite',
      userId,
      productId
    ],
    favoriteProducts: (userId: string, filters: any) => [
      ...favoriteKeys.product.all(),
      'favoriteProducts',
      userId,
      { filters }
    ]
  },
  store: {
    all: () => [...favoriteKeys.all, 'store'],
    count: (storeId: string) => [...favoriteKeys.store.all(), 'count', storeId],
    isFavorite: (userId: string, storeId: string) => [
      ...favoriteKeys.store.all(),
      'isFavorite',
      userId,
      storeId
    ]
  }
}

// Product favorite queries
export const useProductFavoriteCount = (productId: string) => {
  return useQuery({
    queryKey: favoriteKeys.product.count(productId),
    queryFn: () => getWishlistCount(productId),
    select: (data: any) => data?.count || 0,
    enabled: !!productId
  })
}

export const useIsFavoriteProduct = (userId: string, productId: string) => {
  return useQuery({
    queryKey: favoriteKeys.product.isFavorite(userId, productId),
    queryFn: () => checkWishlist(userId, productId),
    select: (data: any) => !!data?.success,
    enabled: !!userId && !!productId
  })
}

// Add new query hook for listing favorite products
export const useFavoriteProducts = (userId: string, filters: any) => {
  return useQuery({
    queryKey: favoriteKeys.product.favoriteProducts(userId, filters),
    queryFn: () => listWishlist(userId, filters),
    enabled: !!userId
  })
}

// Product favorite mutations
export const useFavoriteProduct = () => {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({
      userId,
      productId
    }: {
      userId: string
      productId: string
    }) => wishlist(userId, productId),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      invalidate({
        queryKey: favoriteKeys.product.count(variables.productId)
      })
      invalidate({
        queryKey: favoriteKeys.product.isFavorite(
          variables.userId,
          variables.productId
        )
      })
    }
  })
}

export const useUnfavoriteProduct = () => {
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
      // Invalidate relevant queries
      invalidate({
        queryKey: favoriteKeys.product.count(variables.productId)
      })
      invalidate({
        queryKey: favoriteKeys.product.isFavorite(
          variables.userId,
          variables.productId
        )
      })
    }
  })
}

// Combined hook for toggling product favorite status
export const useToggleProductFavorite = () => {
  const favoriteMutation = useFavoriteProduct()
  const unfavoriteMutation = useUnfavoriteProduct()

  const isPending = favoriteMutation.isPending || unfavoriteMutation.isPending

  const toggleFavorite = (
    userId: string,
    productId: string,
    isCurrentlyFavorite: boolean
  ) => {
    if (isCurrentlyFavorite) {
      return unfavoriteMutation.mutate({ userId, productId })
    } else {
      return favoriteMutation.mutate({ userId, productId })
    }
  }

  return { toggleFavorite, isPending }
}
