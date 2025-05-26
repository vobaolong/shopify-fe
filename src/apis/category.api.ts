import axiosClient, { axiosClientImg } from './client.api'
import { CategoryType, ApiResponse } from '../@types/entity.types'

export type ListCategoriesResponse = {
  size: number
  categories: CategoryType[]
  filter: any
}
export const getCategoryById = async (
  categoryId: string
): Promise<ApiResponse<{ category: CategoryType }>> => {
  return axiosClient.get(`/category/${categoryId}`)
}

export const listActiveCategories = async (
  params: any
): Promise<ListCategoriesResponse> => {
  const fixedParams = { ...params }
  if (fixedParams.categoryId === null) fixedParams.categoryId = 'null'
  return axiosClient.get('/categories/active', { params: fixedParams })
}

export const listCategories = async (
  params: any
): Promise<ListCategoriesResponse> => {
  const fixedParams = { ...params }
  if (fixedParams.categoryId === null) fixedParams.categoryId = 'null'
  return axiosClient.get(`/admin/categories`, { params: fixedParams })
}

export const createCategory = async (category: any): Promise<CategoryType> => {
  return axiosClientImg.post(`/category/create`, category)
}

export const updateCategory = async (
  categoryId: string,
  category: any
): Promise<CategoryType> => {
  return axiosClientImg.put(`/category/${categoryId}`, category)
}

export const removeCategory = async (categoryId: string): Promise<void> => {
  return axiosClient.delete(`/category/${categoryId}`)
}

export const restoreCategory = async (categoryId: string): Promise<void> => {
  return axiosClient.get(`/category/${categoryId}/restore`)
}
