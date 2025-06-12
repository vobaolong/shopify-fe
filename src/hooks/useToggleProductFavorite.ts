import { useMutation } from '@tanstack/react-query'
import { wishlist, unWishlist } from '../apis/wishlist.api'

export function useToggleWishlist() {
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
      isFollowing ? unWishlist(userId, productId) : wishlist(userId, productId)
  })
}
