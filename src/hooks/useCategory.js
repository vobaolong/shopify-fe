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
export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  list: (filters) => [...categoryKeys.lists(), { filters }],
  actives: () => [...categoryKeys.all, 'active'],
  active: (filters) => [...categoryKeys.actives(), { filters }],
  details: () => [...categoryKeys.all, 'detail'],
  detail: (categoryId) => [...categoryKeys.details(), categoryId]
}

// Hooks
export const useActiveCategories = (filters) => {
  return useQuery({
    queryKey: categoryKeys.active(filters),
    queryFn: () => listActiveCategories(filters)
  })
}

export const useCategories = (userId, filters) => {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: () => listCategories(userId, filters),
    enabled: !!userId
  })
}

export const useCategory = (categoryId) => {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: () => getCategoryById(categoryId),
    enabled: !!categoryId
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (category) => createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.actives() })
    }
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (category) => updateCategory(category),
    onSuccess: (data, variables) => {
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
    mutationFn: (categoryId) => removeCategory(categoryId),
    onSuccess: (data, variables) => {
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
    mutationFn: (categoryId) => restoreCategory(categoryId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.categoryId)
      })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.actives() })
    }
  })
}
