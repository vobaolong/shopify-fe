import axiosClient from './client.api'

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
  return await axiosClient.get(`/store/commission/${storeId}`)
}

export const createCommission = async (commission: any) => {
  return await axiosClient.post('commission', commission)
}

export const updateCommission = async (
  commissionId: string,
  commission: any
) => {
  return await axiosClient.put(`/commission/${commissionId}`, commission)
}

export const removeCommission = async (commissionId: string) => {
  return await axiosClient.delete(`/commission/${commissionId}`)
}

export const restoreCommission = async (commissionId: string) => {
  return await axiosClient.get(`/commission/${commissionId}/restore`)
}
