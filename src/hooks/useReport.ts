import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listReportsForAdmin, reportByUser, deleteReport } from '../apis/report'

// Query keys
export const reportKeys = {
  all: ['reports'],
  lists: () => [...reportKeys.all, 'list'],
  list: (filters) => [...reportKeys.lists(), { filters }]
}

// Hooks
export const useReportsForAdmin = (filters) => {
  return useQuery({
    queryKey: reportKeys.list(filters),
    queryFn: () => listReportsForAdmin(filters)
  })
}

export const useReportByUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => reportByUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() })
    }
  })
}

export const useDeleteReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reportId) => deleteReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() })
    }
  })
}
