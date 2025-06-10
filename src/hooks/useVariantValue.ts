import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listValues,
  listActiveValues,
  removeValue,
  restoreValue,
  createValue,
  updateValue
} from '../apis/variant.api'

// Query keys
export const variantValueKeys = {
  all: ['variantValues'],
  lists: () => [...variantValueKeys.all, 'list'],
  list: (variantId: string, isActive?: boolean, filter?: any) => [
    ...variantValueKeys.lists(),
    variantId,
    { isActive, filter }
  ],
  details: () => [...variantValueKeys.all, 'detail'],
  detail: (valueId: string) => [...variantValueKeys.details(), valueId]
}

// Hooks
export const useVariantValues = (
  variantId: string,
  isActive = false,
  filter?: any
) => {
  return useQuery({
    queryKey: variantValueKeys.list(variantId, isActive, filter),
    queryFn: () =>
      isActive
        ? listActiveValues(variantId, filter)
        : listValues(variantId, filter),
    enabled: !!variantId,
    select: (response) => {
      const data = response.data || response
      return {
        variantValues: data.variantValues || [],
        variant: data.variant || {},
        size: data.size || 0,
        filter: data.filter || {}
      }
    }
  })
}

export const useCreateVariantValue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (value: any) => createValue(value),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: variantValueKeys.lists()
      })
    }
  })
}

export const useUpdateVariantValue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ valueId, value }: { valueId: string; value: any }) =>
      updateValue(valueId, value),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: variantValueKeys.lists() })
    }
  })
}

export const useRemoveVariantValue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (valueId: string) => removeValue(valueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variantValueKeys.lists() })
    }
  })
}

export const useRestoreVariantValue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (valueId: string) => restoreValue(valueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variantValueKeys.lists() })
    }
  })
}
