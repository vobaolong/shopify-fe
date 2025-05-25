import axiosClient from './client'

type ReportsResponse = { size: number; reports: any[]; filter: any }
export const listReportsForAdmin = async (
  params: any
): Promise<ReportsResponse> => {
  return axiosClient.get('/admin/reports', {
    params
  })
}

export const reportByUser = async (data: any): Promise<ReportsResponse> => {
  return axiosClient.post('/reports', data)
}

export const deleteReport = async (
  reportId: string
): Promise<ReportsResponse> => {
  return axiosClient.delete(`/admin/report/${reportId}`)
}
