import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query'

export default function useInvalidate() {
	const queryClient = useQueryClient()
	return (filters: InvalidateQueryFilters) => queryClient.invalidateQueries(filters)
}
