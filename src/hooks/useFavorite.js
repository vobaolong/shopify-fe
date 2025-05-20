import { useQuery } from '@tanstack/react-query'
import {
  favoriteProduct,
  unFavoriteProduct,
  getFavoriteCount,
  checkFavoriteProduct,
  listFavoriteProducts
} from '../apis/favoriteProduct'
import { createMutationHook } from './useMutationFactory'

// Query keys
export const favoriteKeys = {
  all: ['favorites'],
  product: {
    all: () => [...favoriteKeys.all, 'product'],
    count: (productId) => [...favoriteKeys.product.all(), 'count', productId],
    isFavorite: (userId, productId) => [
      ...favoriteKeys.product.all(),
      'isFavorite',
      userId,
      productId
    ],
    favoriteProducts: (userId, filters) => [
      ...favoriteKeys.product.all(),
      'favoriteProducts',
      userId,
      { filters }
    ]
  },
  store: {
    all: () => [...favoriteKeys.all, 'store'],
    count: (storeId) => [...favoriteKeys.store.all(), 'count', storeId],
    isFavorite: (userId, storeId) => [
      ...favoriteKeys.store.all(),
      'isFavorite',
      userId,
      storeId
    ]
  }
}

// Product favorite queries
export const useProductFavoriteCount = (productId) => {
  return useQuery({
    queryKey: favoriteKeys.product.count(productId),
    queryFn: () => getFavoriteCount(productId),
    select: (data) => data?.count || 0,
    enabled: !!productId
  })
}

export const useIsFavoriteProduct = (userId, productId) => {
  return useQuery({
    queryKey: favoriteKeys.product.isFavorite(userId, productId),
    queryFn: () => checkFavoriteProduct(userId, productId),
    select: (data) => !!data?.success,
    enabled: !!userId && !!productId
  })
}

// Add new query hook for listing favorite products
export const useFavoriteProducts = (userId, filters) => {
  return useQuery({
    queryKey: favoriteKeys.product.favoriteProducts(userId, filters),
    queryFn: () => listFavoriteProducts(userId, filters),
    enabled: !!userId
  })
}

// Product favorite mutations
export const useFavoriteProduct = createMutationHook(
  ({ userId, productId }) => favoriteProduct(userId, productId),
  (data, variables) => [
    { queryKey: favoriteKeys.product.count(variables.productId) },
    {
      queryKey: favoriteKeys.product.isFavorite(
        variables.userId,
        variables.productId
      )
    }
  ]
)

export const useUnfavoriteProduct = createMutationHook(
  ({ userId, productId }) => unFavoriteProduct(userId, productId),
  (data, variables) => [
    { queryKey: favoriteKeys.product.count(variables.productId) },
    {
      queryKey: favoriteKeys.product.isFavorite(
        variables.userId,
        variables.productId
      )
    }
  ]
)

// Combined hook for toggling product favorite status
export const useToggleProductFavorite = () => {
  const favoriteMutation = useFavoriteProduct()
  const unfavoriteMutation = useUnfavoriteProduct()

  const isPending = favoriteMutation.isPending || unfavoriteMutation.isPending

  const toggleFavorite = (userId, productId, isCurrentlyFavorite) => {
    if (isCurrentlyFavorite) {
      return unfavoriteMutation.mutate({ userId, productId })
    } else {
      return favoriteMutation.mutate({ userId, productId })
    }
  }

  return { toggleFavorite, isPending }
}
