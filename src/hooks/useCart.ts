import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCartCount,
  addToCart,
  listCarts,
  updateCartItem,
  deleteFromCart
} from '../apis/cart.api'

type FiltersType = Record<string, any>

export const cartKeys = {
  all: ['carts'],
  lists: () => [...cartKeys.all, 'list'],
  list: (userId: string, filters: FiltersType) => [
    ...cartKeys.lists(),
    userId,
    { filters }
  ],
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

export const useAddToCart = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, cartItem }: { userId: string; cartItem: any }) =>
      addToCart(userId, cartItem),
    onSuccess: (data: any, variables: { userId: string; cartItem: any }) => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.count(variables.userId)
      })
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    }
  })
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      cartId,
      quantity
    }: {
      userId: string
      cartId: string
      quantity: number
    }) => updateCartItem(userId, quantity, cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    }
  })
}

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, cartId }: { userId: string; cartId: string }) =>
      deleteFromCart(userId, cartId),
    onSuccess: (data: any, variables: { userId: string; cartId: string }) => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.count(variables.userId)
      })
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    }
  })
}
