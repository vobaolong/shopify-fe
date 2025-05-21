import { useMutation } from '@tanstack/react-query'
import { sellerUpdateStatusOrder } from '../apis/order'

export function useSellerUpdateOrderStatus() {
	return useMutation({
		mutationFn: ({ userId, status, orderId, storeId }: { userId: string; status: string; orderId: string; storeId: string }) =>
			sellerUpdateStatusOrder(userId, status, orderId, storeId),
	})
}