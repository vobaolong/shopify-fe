import axiosClient from './client.api'

export const listTransactionsByUser = async (userId: string, params: any) => {
  return await axiosClient.get(`/user/transactions/${userId}`, {
    params
  })
}

export const listTransactionsByStore = async (
  userId: string,
  params: any,
  storeId: string
) => {
  return await axiosClient.get(`/store/transactions/${storeId}/${userId}`, {
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
  return await axiosClient.get(`/user/transaction/${transactionId}/${userId}`)
}

export const getTransactionByStore = async (
  userId: string,
  transactionId: string,
  storeId: string
) => {
  return await axiosClient.get(
    `/store/transaction/${transactionId}/${storeId}/${userId}`
  )
}

export const getTransactionForAdmin = async (
  userId: string,
  transactionId: string
) => {
  return await axiosClient.get(`/admin/transaction/${transactionId}/${userId}`)
}
export const createTransactionByUser = async (
  userId: string,
  transaction: any
) => {
  return await axiosClient.post(`/user/transaction/${userId}`, transaction)
}

export const createTransactionByStore = async (
  userId: string,
  transaction: any,
  storeId: string
) => {
  return await axiosClient.post(
    `/store/transaction/${storeId}/${userId}`,
    transaction
  )
}
