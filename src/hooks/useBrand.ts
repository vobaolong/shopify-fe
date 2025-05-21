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

export const useBrand = (userId: string, brandId: string) => {
	return useQuery({
		queryKey: brandKeys.detail(brandId),
		queryFn: () => getBrandById(userId, brandId),
		enabled: !!userId && !!brandId
	})
}

export const useCreateBrand = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ userId, brand }: { userId: string; brand: any }) => createBrand(userId, brand),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
			queryClient.invalidateQueries({ queryKey: brandKeys.actives() })
		}
	})
}

export const useUpdateBrand = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ userId, brandId, brand }: { userId: string; brandId: string; brand: any }) =>
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
		mutationFn: ({ userId, brandId }: { userId: string; brandId: string }) => removeBrand(userId, brandId),
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
		mutationFn: ({ userId, brandId }: { userId: string; brandId: string }) => restoreBrand(userId, brandId),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: brandKeys.detail(variables.brandId)
			})
			queryClient.invalidateQueries({ queryKey: brandKeys.lists() })
			queryClient.invalidateQueries({ queryKey: brandKeys.actives() })
		}
	})
}
