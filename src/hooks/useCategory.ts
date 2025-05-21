import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	listActiveCategories,
	listCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	removeCategory,
	restoreCategory
} from '../apis/category'

// Query keys
type FiltersType = Record<string, any>
export const categoryKeys = {
	all: ['categories'],
	lists: () => [...categoryKeys.all, 'list'],
	list: (filters: FiltersType) => [...categoryKeys.lists(), { filters }],
	actives: () => [...categoryKeys.all, 'active'],
	active: (filters: FiltersType) => [...categoryKeys.actives(), { filters }],
	details: () => [...categoryKeys.all, 'detail'],
	detail: (categoryId: string) => [...categoryKeys.details(), categoryId]
}

// Hooks
export const useActiveCategories = (filters: FiltersType) => {
	return useQuery({
		queryKey: categoryKeys.active(filters),
		queryFn: () => listActiveCategories(filters)
	})
}

export const useCategories = (userId: string, filters: FiltersType) => {
	return useQuery({
		queryKey: categoryKeys.list(filters),
		queryFn: () => listCategories(userId, filters),
		enabled: !!userId
	})
}

export const useCategory = (categoryId: string) => {
	return useQuery({
		queryKey: categoryKeys.detail(categoryId),
		queryFn: () => getCategoryById(categoryId),
		enabled: !!categoryId
	})
}

export const useCreateCategory = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (category: any) => createCategory(category),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
			queryClient.invalidateQueries({ queryKey: categoryKeys.actives() })
		}
	})
}

export const useUpdateCategory = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ categoryId, category }: { categoryId: string; category: any }) =>
			updateCategory(categoryId, category),
		onSuccess: (data, variables: any) => {
			queryClient.invalidateQueries({
				queryKey: categoryKeys.detail(variables.categoryId)
			})
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
			queryClient.invalidateQueries({ queryKey: categoryKeys.actives() })
		}
	})
}

export const useRemoveCategory = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (categoryId: string) => removeCategory(categoryId),
		onSuccess: (data, variables: any) => {
			queryClient.invalidateQueries({
				queryKey: categoryKeys.detail(variables.categoryId)
			})
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
			queryClient.invalidateQueries({ queryKey: categoryKeys.actives() })
		}
	})
}

export const useRestoreCategory = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (categoryId: string) => restoreCategory(categoryId),
		onSuccess: (data, variables: any) => {
			queryClient.invalidateQueries({
				queryKey: categoryKeys.detail(variables.categoryId)
			})
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
			queryClient.invalidateQueries({ queryKey: categoryKeys.actives() })
		}
	})
}
