import { useMutation } from '@tanstack/react-query'
import { favoriteProduct, unFavoriteProduct } from '../apis/favoriteProduct.api'

export function useToggleProductFavorite() {
  return useMutation({
    mutationFn: ({
      userId,
      productId,
      isFollowing
    }: {
      userId: string
      productId: string
      isFollowing: boolean
    }) =>
      isFollowing
        ? unFavoriteProduct(userId, productId)
        : favoriteProduct(userId, productId)
  })
}
