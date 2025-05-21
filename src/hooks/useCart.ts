import { useQuery } from '@tanstack/react-query'
import {
	getCartCount,
	addToCart,
	listCarts,
	updateCartItem,
	deleteFromCart
} from '../apis/cart'
import { createMutationHook } from './useMutationFactory'

type FiltersType = Record<string, any>

export const cartKeys = {
	all: ['carts'],
	lists: () => [...cartKeys.all, 'list'],
	list: (userId: string, filters: FiltersType) => [...cartKeys.lists(), userId, { filters }],
	counts: () => [...cartKeys.all, 'count'],
	count: (userId: string) => [...cartKeys.counts(), userId]
}

export const useCartCount = (userId: string) => {
	return useQuery({
		queryKey: cartKeys.count(userId),
		queryFn: () => getCartCount(userId),
		enabled: !!userId
	})
}

export const useCartList = (userId: string, filter: FiltersType) => {
	return useQuery({
		queryKey: cartKeys.list(userId, filter),
		queryFn: () => listCarts(userId, filter),
		enabled: !!userId
	})
}

export const useAddToCart = createMutationHook(
	({ userId, cartItem }: { userId: string; cartItem: any }) => addToCart(userId, cartItem),
	(data: any, variables: any) => [
		{ queryKey: cartKeys.count(variables.userId) },
		{ queryKey: cartKeys.lists() }
	]
)

export const useUpdateCartItem = createMutationHook(
	({ userId, cartId, quantity }: { userId: string; cartId: string; quantity: number }) =>
		updateCartItem(userId, quantity, cartId),
	() => [{ queryKey: cartKeys.lists() }]
)

export const useRemoveCartItem = createMutationHook(
	({ userId, cartId }: { userId: string; cartId: string }) => deleteFromCart(userId, cartId),
	(data: any, variables: any) => [
		{ queryKey: cartKeys.count(variables.userId) },
		{ queryKey: cartKeys.lists() }
	]
)
