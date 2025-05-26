import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listBrands,
  listActiveBrands,
  getBrandById,
  createBrand,
  updateBrand,
  removeBrand,
  restoreBrand
} from '../apis/brand.api'

// Query keys
type FiltersType = Record<string, any>
export const brandKeys = {
  all: ['brands'],
  lists: () => [...brandKeys.all, 'list'],
  list: (filters: FiltersType) => [...brandKeys.lists(), { filters }],
  actives: () => [...brandKeys.all, 'active'],
  active: (filters: FiltersType) => [...brandKeys.actives(), { filters }],
  details: () => [...brandKeys.all, 'detail'],
  detail: (brandId: string) => [...brandKeys.details(), brandId]
}

// Hooks
export const useActiveBrands = (filters: FiltersType) => {
  return useQuery({
    queryKey: brandKeys.active(filters),
    queryFn: () => listActiveBrands(filters)
  })
}

export const useBrands = (filters: FiltersType) => {
  return useQuery({
    queryKey: brandKeys.list(filters),
    queryFn: () => listBrands(filters)
  })
}

export const useBrand = (brandId: string) => {
  return useQuery({
    queryKey: brandKeys.detail(brandId),
    queryFn: () => getBrandById(brandId),
    enabled: !!brandId
  })
}

export const useCreateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ brand }: { brand: any }) => createBrand(brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
      queryClient.invalidateQueries({ queryKey: brandKeys.actives() })
    }
  })
}

export const useUpdateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ brandId, brand }: { brandId: string; brand: any }) =>
      updateBrand(brandId, brand),
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
    mutationFn: ({ brandId }: { brandId: string }) => removeBrand(brandId),
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
    mutationFn: ({ brandId }: { brandId: string }) => restoreBrand(brandId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: brandKeys.detail(variables.brandId)
      })
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
      queryClient.invalidateQueries({ queryKey: brandKeys.actives() })
    }
  })
}
