import axiosClient from './client.api'

export const listReportsForAdmin = async (params: any): Promise<any> => {
  return axiosClient.get('/admin/reports', {
    params
  })
}

export const reportByUser = async (data: any) => {
  return axiosClient.post('/reports', data)
}

export const deleteReport = async (reportId: string) => {
  return axiosClient.delete(`/admin/report/${reportId}`)
}
