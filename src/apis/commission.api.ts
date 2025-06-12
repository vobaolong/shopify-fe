import client from './client.api'

type CommissionFilter = {
  search: string
  sortBy: string
  order: string
  limit: number
  page: number
}

export const listActiveCommissions = async (): Promise<any> => {
  return client.get('/commission/active')
}

export const listCommissions = async (
  filter: CommissionFilter
): Promise<any> => {
  return client.get(`/admin/commissions`, {
    params: filter
  })
}

export const getCommissionByStore = async (storeId: string) => {
  return await client.get(`/store/commission/${storeId}`)
}

export const createCommission = async (commission: any) => {
  return await client.post('commission', commission)
}

export const updateCommission = async (
  commissionId: string,
  commission: any
) => {
  return await client.put(`/commission/${commissionId}`, commission)
}

export const removeCommission = async (commissionId: string) => {
  return await client.delete(`/commission/${commissionId}`)
}

export const restoreCommission = async (commissionId: string) => {
  return await client.get(`/commission/${commissionId}/restore`)
}
