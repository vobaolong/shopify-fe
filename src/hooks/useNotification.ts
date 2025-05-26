import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  updateRead,
  deleteNotifications,
  sendBanStoreEmail,
  sendCreateStoreEmail,
  sendActiveStoreEmail,
  sendActiveProductEmail,
  sendBanProductEmail
} from '../apis/notification.api'

// Query keys
export const notificationKeys = {
  all: ['notifications'],
  byUser: (userId) => [...notificationKeys.all, userId]
}

// Get notifications hook
export const useNotifications = (userId) => {
  return useQuery({
    queryKey: notificationKeys.byUser(userId),
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
    refetchInterval: 30000 // Refetch every 30 seconds
  })
}

// Mark notifications as read
export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId) => updateRead(userId),
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.byUser(userId)
      })
    }
  })
}

// Delete notifications
export const useDeleteNotifications = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId) => deleteNotifications(userId),
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.byUser(userId)
      })
    }
  })
}

// Email notification hooks
export const useSendBanStoreEmail = () => {
  return useMutation({
    mutationFn: ({ userId, storeId }) => sendBanStoreEmail(userId, storeId)
  })
}

export const useSendCreateStoreEmail = () => {
  return useMutation({
    mutationFn: ({ userId, storeId }) => sendCreateStoreEmail(userId, storeId)
  })
}

export const useSendActiveStoreEmail = () => {
  return useMutation({
    mutationFn: ({ userId, storeId }) => sendActiveStoreEmail(userId, storeId)
  })
}

export const useSendActiveProductEmail = () => {
  return useMutation({
    mutationFn: (userId) => sendActiveProductEmail(userId)
  })
}

export const useSendBanProductEmail = () => {
  return useMutation({
    mutationFn: (userId) => sendBanProductEmail(userId)
  })
}
