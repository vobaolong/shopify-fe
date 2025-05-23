import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	getStore,
	getStoreProfile,
	updateProfile,
	searchStores,
	listActiveStores,
	followStore,
	unfollowStore,
	checkFollowingStore
} from '../apis/store'
import { getToken } from '../apis/auth'
import { useDispatch } from 'react-redux'
import { addStore } from '../store/slices/storeSlice'

// Query keys for stores
export const storeKeys = {
	all: ['stores'],
	lists: () => [...storeKeys.all, 'list'],
	list: (filters) => [...storeKeys.lists(), { filters }],
	details: () => [...storeKeys.all, 'detail'],
	detail: (storeId) => [...storeKeys.details(), storeId],
	profile: (storeId, userId) => [
		...storeKeys.details(),
		'profile',
		storeId,
		userId
	],
	following: (storeId, userId) => [...storeKeys.all, 'follow', storeId, userId]
}

/**
 * Hook to get store details
 * @param {string} storeId - Store ID
 */
export const useStore = (storeId) => {
	return useQuery({
		queryKey: storeKeys.detail(storeId),
		queryFn: () => getStore(storeId),
		enabled: !!storeId
	})
}

/**
 * Hook to get store profile (for management)
 * @param {string} storeId - Store ID
 * @param {string} userId - User ID
 */
export const useStoreProfile = (storeId, userId) => {
	const dispatch = useDispatch()
	const { accessToken } = getToken() || {}
	return useQuery({
		queryKey: storeKeys.profile(storeId, userId),
		queryFn: () => getStoreProfile(userId, storeId),
		enabled: !!(storeId && userId && accessToken),
		onSuccess: (data) => {
			if (data && !data.error) {
				dispatch(addStore(data))
			}
		}
	})
}

/**
 * Hook to search stores
 * @param {Object} filters - Search params
 */
export const useSearchStores = (filters) => {
	return useQuery({
		queryKey: storeKeys.list(filters),
		queryFn: () => searchStores(filters),
		enabled: !!filters
	})
}

/**
 * Hook to list active stores
 * @param {Object} filters - Filter params
 */
export const useActiveStores = (filters) => {
	return useQuery({
		queryKey: storeKeys.list(filters),
		queryFn: () => listActiveStores(filters),
		enabled: !!filters
	})
}

/**
 * Hook to check if user is following a store
 */
export const useCheckFollowingStore = (storeId) => {
	const { _id: userId } = getToken() || {}
	return useQuery({
		queryKey: storeKeys.following(storeId, userId),
		queryFn: () => checkFollowingStore(userId, storeId),
		enabled: !!(storeId && userId)
	})
}

/**
 * Hook to update store profile
 */
export const useUpdateStore = () => {
	const queryClient = useQueryClient()
	const { _id: userId } = getToken() || {}
	return useMutation({
		mutationFn: ({ store, storeId }) => updateProfile(userId, store, storeId),
		onSuccess: (data, { storeId }) => {
			queryClient.invalidateQueries({ queryKey: storeKeys.detail(storeId) })
			queryClient.invalidateQueries({
				queryKey: storeKeys.profile(storeId, userId)
			})
		}
	})
}

/**
 * Hook to follow a store
 */
export const useFollowStore = () => {
	const queryClient = useQueryClient()
	const { _id: userId } = getToken() || {}
	return useMutation({
		mutationFn: (storeId) => followStore(userId, storeId),
		onSuccess: (data, storeId) => {
			queryClient.invalidateQueries({
				queryKey: storeKeys.following(storeId, userId)
			})
			queryClient.invalidateQueries({ queryKey: storeKeys.detail(storeId) })
		}
	})
}

/**
 * Hook to unfollow a store
 */
export const useUnfollowStore = () => {
	const queryClient = useQueryClient()
	const { _id: userId } = getToken() || {}
	return useMutation({
		mutationFn: (storeId) => unfollowStore(userId, storeId),
		onSuccess: (data, storeId) => {
			queryClient.invalidateQueries({
				queryKey: storeKeys.following(storeId, userId)
			})
			queryClient.invalidateQueries({ queryKey: storeKeys.detail(storeId) })
		}
	})
}
