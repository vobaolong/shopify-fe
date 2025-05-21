import { useMutation } from '@tanstack/react-query'
import { openStore } from '../apis/store'

export function useOpenCloseStore() {
	return useMutation({
		mutationFn: ({ userId, value, storeId }: { userId: string; value: { isOpen: boolean }; storeId: string }) =>
			openStore(userId, value, storeId),
	})
}