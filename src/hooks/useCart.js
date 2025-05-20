import { useQuery } from '@tanstack/react-query'
import {
  getCartCount,
  addToCart,
  listCarts,
  updateCartItem,
  removeCartItem
} from '../apis/cart'
import { createMutationHook } from './useMutationFactory'

export const cartKeys = {
  all: ['carts'],
  lists: () => [...cartKeys.all, 'list'],
  list: (userId, filters) => [...cartKeys.lists(), userId, { filters }],
  counts: () => [...cartKeys.all, 'count'],
  count: (userId) => [...cartKeys.counts(), userId]
}

export const useCartCount = (userId) => {
  return useQuery({
    queryKey: cartKeys.count(userId),
    queryFn: () => getCartCount(userId),
    enabled: !!userId
  })
}

export const useCartList = (userId, filter) => {
  return useQuery({
    queryKey: cartKeys.list(userId, filter),
    queryFn: () => listCarts(userId, filter),
    enabled: !!userId
  })
}

export const useAddToCart = createMutationHook(
  ({ userId, cartItem }) => addToCart(userId, cartItem),
  (data, variables) => [
    { queryKey: cartKeys.count(variables.userId) },
    { queryKey: cartKeys.lists() }
  ]
)

export const useUpdateCartItem = createMutationHook(
  ({ userId, cartId, quantity }) => updateCartItem(userId, cartId, quantity),
  () => [{ queryKey: cartKeys.lists() }]
)

export const useRemoveCartItem = createMutationHook(
  ({ userId, cartId }) => removeCartItem(userId, cartId),
  (data, variables) => [
    { queryKey: cartKeys.count(variables.userId) },
    { queryKey: cartKeys.lists() }
  ]
)
