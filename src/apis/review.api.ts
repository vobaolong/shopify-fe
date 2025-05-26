import axiosClient from './client.api'

export const listReviews = async (params: any) => {
  return await axiosClient.get('/reviews', {
    params
  })
}

export const checkReview = async (userId: string, data: any) => {
  return await axiosClient.post(`/review/check/${userId}`, data)
}

export const reviewProduct = async (userId: string, review: any) => {
  return await axiosClient.post(`/review/create/${userId}`, review)
}

export const updateReview = async (
  userId: string,
  review: any,
  reviewId: string
) => {
  return await axiosClient.put(`/review/${reviewId}/${userId}`, review)
}

export const deleteReview = async (userId: string, reviewId: string) => {
  return await axiosClient.delete(`/review/${reviewId}/${userId}`)
}

export const restoreReview = async (userId: string, reviewId: string) => {
  return await axiosClient.get(`/review/restore/${reviewId}/${userId}`)
}
