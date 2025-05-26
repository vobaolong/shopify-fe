import { useMutation } from '@tanstack/react-query'
import { followStore, unfollowStore } from '../apis/followStore.api'

export function useToggleFollowStore() {
  return useMutation({
    mutationFn: ({
      userId,
      storeId,
      isFollowing
    }: {
      userId: string
      storeId: string
      isFollowing: boolean
    }) =>
      isFollowing
        ? unfollowStore(userId, storeId)
        : followStore(userId, storeId)
  })
}
