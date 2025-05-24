import axiosClient, { axiosClientImg } from './client'

export const getProduct = async (productId: string) => {
  try {
    return await axiosClient.get(`/product/${productId}`)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getProductByIdForManager = async (
  userId: string,
  productId: string,
  storeId: string
) => {
  try {
    return await axiosClient.get(
      `/product/for/manager/${productId}/${storeId}/${userId}`
    )
  } catch (error) {
    console.log(error)
    throw error
  }
}

//list product
export const listActiveProducts = async (filter: any) => {
  const {
    search,
    sortBy,
    order,
    limit,
    page,
    rating,
    minPrice,
    maxPrice,
    categoryId,
    brandId,
    provinces
  } = filter
  const queryParams = {
    search,
    rating,
    minPrice,
    maxPrice,
    categoryId,
    brandId,
    sortBy,
    order,
    limit,
    page,
    provinces
  }
  try {
    const response = await axiosClient.get('/active/products', {
      params: queryParams
    })
    return response
  } catch (error) {
    console.error('Error fetching active products:', error)
    throw error
  }
}

export const listSellingProductsByStore = async (
  filter: any,
  storeId: string
) => {
  const {
    search,
    sortBy,
    order,
    limit,
    page,
    rating,
    minPrice,
    maxPrice,
    categoryId,
    brandId
  } = filter
  try {
    return await axiosClient.get(`/selling/products/by/store/${storeId}`, {
      params: {
        search,
        rating,
        minPrice,
        maxPrice,
        categoryId,
        brandId,
        sortBy,
        order,
        limit,
        page
      }
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const listProductsForManager = async (
  userId: string,
  filter: any,
  storeId: string
) => {
  const { search, sortBy, order, limit, page, isSelling, quantity, isActive } =
    filter
  try {
    return await axiosClient.get(`/products/by/store/${storeId}/${userId}`, {
      params: {
        search,
        isSelling,
        isActive,
        quantity,
        sortBy,
        order,
        limit,
        page
      }
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

type ProductsResponse = { size: number; products: any[]; filter: any }
export const listProductsForAdmin = async (
  params: any
): Promise<ProductsResponse> => {
  return axiosClient.get('/admin/products', { params })
}

//sell-store product
export const sellingProduct = async (
  userId: string,
  value: any,
  storeId: string,
  productId: string
) => {
  try {
    return await axiosClient.put(
      `/product/selling/${productId}/${storeId}/${userId}`,
      value
    )
  } catch (error) {
    console.log(error)
    throw error
  }
}

//activeProduct
type ActiveProductResponse = {
  message: string
  product: any
}
export const activeProduct = async (
  value: any,
  productId: string
): Promise<ActiveProductResponse> => {
  return axiosClient.put(`/admin/active-product/${productId}`, value)
}

//ban product
export const banProduct = async (
  userId: string,
  value: any,
  productId: string
) => {
  try {
    return await axiosClient.put(`/product/ban/${productId}/${userId}`, value)
  } catch (error) {
    console.log(error)
    throw error
  }
}

//crud
export const createProduct = async (
  userId: string,
  product: any,
  storeId: string
) => {
  try {
    return await axiosClientImg.post(
      `/product/create/${storeId}/${userId}`,
      product
    )
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateProduct = async (
  userId: string,
  product: any,
  productId: string,
  storeId: string
) => {
  try {
    return await axiosClientImg.put(
      `/product/update/${productId}/${storeId}/${userId}`,
      product
    )
  } catch (error) {
    console.log(error)
    throw error
  }
}

//list listImages
export const addListImages = async (
  userId: string,
  photo: any,
  productId: string,
  storeId: string
) => {
  try {
    return await axiosClientImg.post(
      `/store/${storeId}/user/${userId}/product/${productId}/images`,
      photo
    )
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateListImages = async (
  userId: string,
  photo: any,
  index: number,
  productId: string,
  storeId: string
) => {
  return await axiosClientImg.put(
    `/store/${storeId}/user/${userId}/product/${productId}/images`,
    photo,
    {
      params: { index }
    }
  )
}

export const removeListImages = async (
  userId: string,
  index: number,
  productId: string,
  storeId: string
) => {
  try {
    return await axiosClient.delete(
      `/store/${storeId}/user/${userId}/product/${productId}/images`,
      {
        params: { index }
      }
    )
  } catch (error) {
    console.log(error)
    throw error
  }
}
