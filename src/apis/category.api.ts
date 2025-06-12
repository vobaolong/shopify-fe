import client, { clientImg } from './client.api'
import { CategoryType, ApiResponse } from '../@types/entity.types'

export type ListCategoriesResponse = {
  size: number
  categories: CategoryType[]
  filter: any
}
export const getCategoryById = async (
  categoryId: string
): Promise<ApiResponse<{ category: CategoryType }>> => {
  return client.get(`/category/${categoryId}`)
}

export const listActiveCategories = async (
  params: any
): Promise<ListCategoriesResponse> => {
  const fixedParams = { ...params }
  if (fixedParams.categoryId === null) fixedParams.categoryId = 'null'
  return client.get('/categories/active', { params: fixedParams })
}

export const listCategories = async (
  params: any
): Promise<ListCategoriesResponse> => {
  const fixedParams = { ...params }
  if (fixedParams.categoryId === null) fixedParams.categoryId = 'null'
  return client.get(`/admin/categories`, { params: fixedParams })
}

export const createCategory = async (category: any): Promise<CategoryType> => {
  return clientImg.post(`/category/create`, category)
}

export const updateCategory = async (
  categoryId: string,
  category: any
): Promise<CategoryType> => {
  return clientImg.put(`/category/${categoryId}`, category)
}

export const removeCategory = async (categoryId: string): Promise<void> => {
  return client.delete(`/category/${categoryId}`)
}

export const restoreCategory = async (categoryId: string): Promise<void> => {
  return client.get(`/category/${categoryId}/restore`)
}
