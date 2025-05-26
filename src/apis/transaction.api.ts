import axiosClient from './client.api'

export const listTransactionsByUser = async (userId: string, params: any) => {
  return await axiosClient.get(`/transactions/by/user/${userId}`, {
    params
  })
}

export const listTransactionsByStore = async (
  userId: string,
  params: any,
  storeId: string
) => {
  return await axiosClient.get(`/transactions/by/store/${storeId}/${userId}`, {
    params
  })
}

export const listTransactionsForAdmin = async (params: any) => {
  return axiosClient.get(`/admin/transactions`, {
    params
  })
}

export const getTransactionByUser = async (
  userId: string,
  transactionId: string
) => {
  return await axiosClient.get(
    `/transaction/by/user/${transactionId}/${userId}`
  )
}

export const getTransactionByStore = async (
  userId: string,
  transactionId: string,
  storeId: string
) => {
  return await axiosClient.get(
    `/transaction/by/store/${transactionId}/${storeId}/${userId}`
  )
}

export const getTransactionForAdmin = async (
  userId: string,
  transactionId: string
) => {
  return await axiosClient.get(
    `/transaction/by/admin/${transactionId}/${userId}`
  )
}
export const createTransactionByUser = async (
  userId: string,
  transaction: any
) => {
  return await axiosClient.post(
    `/transaction/create/by/user/${userId}`,
    transaction
  )
}

export const createTransactionByStore = async (
  userId: string,
  transaction: any,
  storeId: string
) => {
  return await axiosClient.post(
    `/transaction/create/by/store/${storeId}/${userId}`,
    transaction
  )
}
