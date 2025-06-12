import client from './client.api'

export const listReviews = async (params: any) => {
  return await client.get('/reviews', {
    params
  })
}

export const checkReview = async (userId: string, data: any) => {
  return await client.post(`/review/check/${userId}`, data)
}

export const reviewProduct = async (userId: string, review: any) => {
  return await client.post(`/review/create/${userId}`, review)
}

export const updateReview = async (
  userId: string,
  review: any,
  reviewId: string
) => {
  return await client.put(`/review/${reviewId}/${userId}`, review)
}

export const deleteReview = async (userId: string, reviewId: string) => {
  return await client.delete(`/review/${reviewId}/${userId}`)
}

export const deleteReviewByAdmin = async (reviewId: string) => {
  return await client.delete(`/admin/review/${reviewId}`)
}

export const restoreReview = async (userId: string, reviewId: string) => {
  return await client.get(`/review/restore/${reviewId}/${userId}`)
}
