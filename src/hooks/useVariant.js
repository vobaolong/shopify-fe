import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getVariantById,
  listVariants,
  listActiveVariants,
  listVariantByCategory,
  createVariant,
  updateVariant,
  removeVariant,
  restoreVariant,
  getValueById,
  createValue,
  updateValue,
  removeValue,
  restoreValue
} from '../apis/variant'

// Query keys
export const variantKeys = {
  all: ['variants'],
  lists: () => [...variantKeys.all, 'list'],
  list: (filters) => [...variantKeys.lists(), { filters }],
  actives: () => [...variantKeys.all, 'active'],
  active: (filters) => [...variantKeys.actives(), { filters }],
  byCategory: (categoryId) => [...variantKeys.all, 'byCategory', categoryId],
  details: () => [...variantKeys.all, 'detail'],
  detail: (variantId) => [...variantKeys.details(), variantId],
  values: () => [...variantKeys.all, 'values'],
  value: (valueId) => [...variantKeys.values(), valueId]
}

// Variant hooks
export const useVariant = (userId, variantId) => {
  return useQuery({
    queryKey: variantKeys.detail(variantId),
    queryFn: () => getVariantById(userId, variantId),
    enabled: !!userId && !!variantId
  })
}

export const useVariants = (userId, filters) => {
  return useQuery({
    queryKey: variantKeys.list(filters),
    queryFn: () => listVariants(userId, filters),
    enabled: !!userId
  })
}

export const useActiveVariants = (filters) => {
  return useQuery({
    queryKey: variantKeys.active(filters),
    queryFn: () => listActiveVariants(filters)
  })
}

export const useVariantByCategory = (categoryId) => {
  return useQuery({
    queryKey: variantKeys.byCategory(categoryId),
    queryFn: () => listVariantByCategory(categoryId),
    enabled: !!categoryId
  })
}

export const useCreateVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, variant }) => createVariant(userId, variant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variantKeys.lists() })
      queryClient.invalidateQueries({ queryKey: variantKeys.actives() })
    }
  })
}

export const useUpdateVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, variantId, variant }) =>
      updateVariant(userId, variantId, variant),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: variantKeys.detail(variables.variantId)
      })
      queryClient.invalidateQueries({ queryKey: variantKeys.lists() })
      queryClient.invalidateQueries({ queryKey: variantKeys.actives() })
    }
  })
}

export const useRemoveVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, variantId }) => removeVariant(userId, variantId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: variantKeys.detail(variables.variantId)
      })
      queryClient.invalidateQueries({ queryKey: variantKeys.lists() })
      queryClient.invalidateQueries({ queryKey: variantKeys.actives() })
    }
  })
}

export const useRestoreVariant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, variantId }) => restoreVariant(userId, variantId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: variantKeys.detail(variables.variantId)
      })
      queryClient.invalidateQueries({ queryKey: variantKeys.lists() })
      queryClient.invalidateQueries({ queryKey: variantKeys.actives() })
    }
  })
}

// Variant value hooks
export const useVariantValue = (userId, valueId) => {
  return useQuery({
    queryKey: variantKeys.value(valueId),
    queryFn: () => getValueById(userId, valueId),
    enabled: !!userId && !!valueId
  })
}

export const useCreateValue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, value }) => createValue(userId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variantKeys.values() })
      // This will likely affect variants as well
      queryClient.invalidateQueries({ queryKey: variantKeys.lists() })
    }
  })
}

export const useUpdateValue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, valueId, value }) =>
      updateValue(userId, valueId, value),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: variantKeys.value(variables.valueId)
      })
      queryClient.invalidateQueries({ queryKey: variantKeys.values() })
      // This will likely affect variants as well
      queryClient.invalidateQueries({ queryKey: variantKeys.lists() })
    }
  })
}

export const useRemoveValue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, valueId }) => removeValue(userId, valueId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: variantKeys.value(variables.valueId)
      })
      queryClient.invalidateQueries({ queryKey: variantKeys.values() })
      // This will likely affect variants as well
      queryClient.invalidateQueries({ queryKey: variantKeys.lists() })
    }
  })
}

export const useRestoreValue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, valueId }) => restoreValue(userId, valueId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: variantKeys.value(variables.valueId)
      })
      queryClient.invalidateQueries({ queryKey: variantKeys.values() })
      // This will likely affect variants as well
      queryClient.invalidateQueries({ queryKey: variantKeys.lists() })
    }
  })
}
