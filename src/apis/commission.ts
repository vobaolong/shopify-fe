import axiosClient from './client'

type CommissionFilter = {
  search: string
  sortBy: string
  order: string
  limit: number
  page: number
}

export const listActiveCommissions = async (): Promise<any> => {
  return axiosClient.get('/commission/active')
}

export const listCommissions = async (
  filter: CommissionFilter
): Promise<any> => {
  return axiosClient.get(`/admin/commissions`, {
    params: filter
  })
}

export const getCommissionByStore = async (storeId: string) => {
  try {
    const res = await axiosClient.get(`/store/commission/${storeId}`)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const createCommission = async (commission: any) => {
  try {
    const res = await axiosClient.post('commission', commission)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateCommission = async (
  commissionId: string,
  commission: any
) => {
  try {
    const res = await axiosClient.put(`/commission/${commissionId}`, commission)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const removeCommission = async (commissionId: string) => {
  try {
    const res = await axiosClient.delete(`/commission/${commissionId}`)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const restoreCommission = async (commissionId: string) => {
  try {
    const res = await axiosClient.get(`/commission/${commissionId}/restore`)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}
