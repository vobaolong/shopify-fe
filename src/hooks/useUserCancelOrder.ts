import { useMutation } from '@tanstack/react-query'
import { userCancelOrder } from '../apis/order'

export function useUserCancelOrder() {
	return useMutation({
		mutationFn: ({ userId, orderId }: { userId: string; orderId: string }) =>
			userCancelOrder(userId, 'Cancelled', orderId),
	})
}