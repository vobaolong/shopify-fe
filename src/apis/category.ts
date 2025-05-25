import axiosClient from './client'
import { CategoryType } from '../@types/entity.types'

export type ListCategoriesResponse = {
  size: number
  categories: CategoryType[]
  filter: any
}
export const getCategoryById = async (
  categoryId: string
): Promise<CategoryType> => {
  return axiosClient.get(`/category/${categoryId}`)
}

export const listActiveCategories = async (
  params: any
): Promise<ListCategoriesResponse> => {
  return axiosClient.get('/categories/active', { params })
}

export const listCategories = async (
  params: any
): Promise<ListCategoriesResponse> => {
  return axiosClient.get(`/admin/categories`, { params })
}

export const createCategory = async (category: any): Promise<CategoryType> => {
  return axiosClient.post(`/category/create`, category)
}

export const updateCategory = async (
  categoryId: string,
  category: any
): Promise<CategoryType> => {
  return axiosClient.put(`/category/${categoryId}`, category)
}

export const removeCategory = async (categoryId: string): Promise<void> => {
  return axiosClient.delete(`/category/${categoryId}`)
}

export const restoreCategory = async (categoryId: string): Promise<void> => {
  return axiosClient.get(`/category/${categoryId}/restore`)
}
