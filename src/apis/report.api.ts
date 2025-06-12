import client from './client.api'

export const listReportsForAdmin = async (params: any): Promise<any> => {
  return client.get('/admin/reports', {
    params
  })
}

export const reportByUser = async (data: any) => {
  return client.post('/reports', data)
}

export const deleteReport = async (reportId: string) => {
  return client.delete(`/admin/report/${reportId}`)
}
