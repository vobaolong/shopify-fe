import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUser, updateUser, getUserById } from '../apis/user'
import { useDispatch } from 'react-redux'
import { addUser } from '../slices/userSlice'

// Query keys for users
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id]
}

/**
 * Hook to get current user profile
 * @param {string} userId - User ID
 */
export const useCurrentUser = (userId) => {
  const dispatch = useDispatch()

  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUser(userId),
    enabled: !!userId,
    onSuccess: (data) => {
      // Update Redux store with user data
      dispatch(addUser(data))
    }
  })
}

/**
 * Hook to get user by ID
 * @param {string} userId - User ID to fetch
 */
export const useUserById = (userId) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId
  })
}

/**
 * Hook to update user with auto-invalidation
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData),
    onSuccess: (data, { userId }) => {
      // Invalidate user details cache
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
    }
  })
}
