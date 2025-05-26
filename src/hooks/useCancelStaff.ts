import { useMutation } from '@tanstack/react-query'
import { cancelStaff } from '../apis/store.api'

export function useCancelStaff() {
  return useMutation({
    mutationFn: ({ userId, storeId }: { userId: string; storeId: string }) =>
      cancelStaff(userId, storeId)
  })
}
