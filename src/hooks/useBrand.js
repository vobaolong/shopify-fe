import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listBrands,
  listActiveBrands,
  getBrandById,
  createBrand,
  updateBrand,
  removeBrand,
  restoreBrand
} from '../apis/brand'

// Query keys
export const brandKeys = {
  all: ['brands'],
  lists: () => [...brandKeys.all, 'list'],
  list: (filters) => [...brandKeys.lists(), { filters }],
  actives: () => [...brandKeys.all, 'active'],
  active: (filters) => [...brandKeys.actives(), { filters }],
  details: () => [...brandKeys.all, 'detail'],
  detail: (brandId) => [...brandKeys.details(), brandId]
}

// Hooks
export const useActiveBrands = (filters) => {
  return useQuery({
    queryKey: brandKeys.active(filters),
    queryFn: () => listActiveBrands(filters)
  })
}

export const useBrands = (filters) => {
  return useQuery({
    queryKey: brandKeys.list(filters),
    queryFn: () => listBrands(filters)
  })
}

export const useBrand = (userId, brandId) => {
  return useQuery({
    queryKey: brandKeys.detail(brandId),
    queryFn: () => getBrandById(userId, brandId),
    enabled: !!userId && !!brandId
  })
}

export const useCreateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, brand }) => createBrand(userId, brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
      queryClient.invalidateQueries({ queryKey: brandKeys.actives() })
    }
  })
}

export const useUpdateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, brandId, brand }) =>
      updateBrand(userId, brandId, brand),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: brandKeys.detail(variables.brandId)
      })
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
      queryClient.invalidateQueries({ queryKey: brandKeys.actives() })
    }
  })
}

export const useRemoveBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, brandId }) => removeBrand(userId, brandId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: brandKeys.detail(variables.brandId)
      })
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
      queryClient.invalidateQueries({ queryKey: brandKeys.actives() })
    }
  })
}

export const useRestoreBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, brandId }) => restoreBrand(userId, brandId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: brandKeys.detail(variables.brandId)
      })
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
      queryClient.invalidateQueries({ queryKey: brandKeys.actives() })
    }
  })
}
